const XLSX = require("xlsx");
const { Series, Specific } = require("../models");

const normalizeText = (value) => {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/^[\s•●▪◦·]+/g, "")
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const isValidItemNo = (value) => {
  if (!value) return false;

  return /^\d+\/[A-Za-z0-9-]+$/.test(String(value).trim());
};

const isCategoryRow = ({ itemNo, title, retentionPeriod }) => {
  const first = String(itemNo || "").trim();

  if (!first) return false;
  if (isValidItemNo(first)) return false;
  if (title || retentionPeriod) return false;

  const upper = first.toUpperCase();

  if (upper.includes("GENERAL RECORDS DISPOSITION")) return false;
  if (upper.includes("COMMON TO ALL")) return false;
  if (upper.startsWith("SERIES ")) return false;
  if (upper.includes("ITEM NUMBER")) return false;

  return upper.includes("RECORDS");
};

const isHeaderOrSectionRow = ({ itemNo, title, retentionPeriod }) => {
  const first = String(itemNo || "")
    .trim()
    .toUpperCase();
  const second = String(title || "")
    .trim()
    .toUpperCase();
  const third = String(retentionPeriod || "")
    .trim()
    .toUpperCase();

  if (!first && !second && !third) return true;
  if (first.includes("GENERAL RECORDS DISPOSITION SCHEDULE")) return true;
  if (first.includes("COMMON TO ALL")) return true;
  if (first.includes("ITEM NUMBER")) return true;
  if (second.includes("RECORDS SERIES TITLE")) return true;
  if (third.includes("AUTHORIZED RETENTION PERIOD")) return true;
  if (first.startsWith("SERIES ")) return true;
  if (second.startsWith("SERIES ")) return true;

  return false;
};

const readExcelRows = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
  });

  return {
    rows,
    merges: worksheet["!merges"] || [],
  };
};

const buildImportPreview = (filePath, fallbackCategory = null) => {
  const { rows, merges } = readExcelRows(filePath);

  const parsed = [];
  const skippedRows = [];
  const categorySummary = {};

  let currentSeries = null;
  let currentCategory = null;

  rows.forEach((row, index) => {
    const rowNumber = index + 1;

    const itemNo = normalizeText(row[0]);
    const title = normalizeText(row[1]);
    const retentionPeriod = normalizeText(row[2]);

    if (
      isCategoryRow({ itemNo, title, retentionPeriod }) ||
      isMergedCategoryRow({
        rowIndex: index,
        itemNo,
        title,
        retentionPeriod,
        merges,
      })
    ) {
      const categoryName = itemNo;

      currentCategory = categoryName;
      currentSeries = null;

      if (!categorySummary[currentCategory]) {
        categorySummary[currentCategory] = {
          name: currentCategory,
          totalSeries: 0,
          totalSpecifics: 0,
        };
      }

      skippedRows.push({
        rowNumber,
        reason: "Category row",
        itemNo,
        title,
        retentionPeriod,
      });

      return;
    }

    if (isHeaderOrSectionRow({ itemNo, title, retentionPeriod })) {
      currentSeries = null;

      const upperItemNo = String(itemNo || "").toUpperCase();
      const upperTitle = String(title || "").toUpperCase();

      const isScheduleBoundary =
        upperItemNo.includes("GENERAL RECORDS DISPOSITION SCHEDULE") ||
        upperItemNo.includes("COMMON TO ALL") ||
        upperItemNo.startsWith("SERIES ") ||
        upperTitle.startsWith("SERIES ");

      if (isScheduleBoundary) {
        currentCategory = null;
      }

      skippedRows.push({
        rowNumber,
        reason: "Header or section row",
        itemNo,
        title,
        retentionPeriod,
      });

      return;
    }

    if (isValidItemNo(itemNo)) {
      const resolvedCategory = currentCategory || fallbackCategory || null;

      currentSeries = {
        rowNumber,
        type: "SERIES",
        itemNo,
        title,
        retentionPeriod: retentionPeriod || null,
        category: resolvedCategory,
        specifics: [],
      };

      parsed.push(currentSeries);

      if (resolvedCategory) {
        if (!categorySummary[resolvedCategory]) {
          categorySummary[resolvedCategory] = {
            name: resolvedCategory,
            totalSeries: 0,
            totalSpecifics: 0,
          };
        }

        categorySummary[resolvedCategory].totalSeries += 1;
      }

      return;
    }

    if (!itemNo && title && currentSeries) {
      const specific = {
        rowNumber,
        type: "SPECIFIC",
        title,
        retentionPeriod: retentionPeriod || currentSeries.retentionPeriod,
      };

      currentSeries.specifics.push(specific);

      if (currentSeries.category) {
        categorySummary[currentSeries.category].totalSpecifics += 1;
      }

      return;
    }

    skippedRows.push({
      rowNumber,
      reason: "Unrecognized row format",
      itemNo,
      title,
      retentionPeriod,
    });
  });

  const totalSeries = parsed.length;
  const totalSpecifics = parsed.reduce(
    (sum, series) => sum + series.specifics.length,
    0,
  );

  return {
    totalSeries,
    totalSpecifics,
    totalSkippedRows: skippedRows.length,
    categories: Object.values(categorySummary),
    skippedRows: skippedRows.slice(0, 50),
    series: parsed,
  };
};

const isMergedCategoryRow = ({
  rowIndex,
  itemNo,
  title,
  retentionPeriod,
  merges,
}) => {
  if (isValidItemNo(itemNo)) return false;
  if (!itemNo || title || retentionPeriod) return false;

  return merges.some((merge) => {
    return (
      merge.s.r === rowIndex &&
      merge.e.r === rowIndex &&
      merge.s.c === 0 &&
      merge.e.c >= 2
    );
  });
};

const importPreviewToDatabase = async ({
  recordsScheduleId,
  rdsYear,
  category,
  preview,
}) => {
  const createdSeries = [];

  for (const seriesItem of preview.series) {
    const series = await Series.create({
      ItemNoID: seriesItem.itemNo,
      SeriesName: seriesItem.title,
      RetentionPeriod: seriesItem.retentionPeriod,
      RdsYear: rdsYear || null,
      Category: seriesItem.category || category || "UNCATEGORIZED",
      RecordsScheduleID: recordsScheduleId,
      DepartmentID: null,
    });

    for (const specificItem of seriesItem.specifics) {
      await Specific.create({
        SeriesID: series.SeriesID,
        SpecificName: specificItem.title,
        RetentionPeriod:
          specificItem.retentionPeriod || seriesItem.retentionPeriod || "",
      });
    }

    createdSeries.push(series);
  }

  return {
    importedSeries: createdSeries.length,
    importedSpecifics: preview.totalSpecifics,
  };
};

module.exports = {
  buildImportPreview,
  importPreviewToDatabase,
};
