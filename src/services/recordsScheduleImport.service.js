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
  const first = String(itemNo || "").trim().toUpperCase();
  const second = String(title || "").trim().toUpperCase();
  const third = String(retentionPeriod || "").trim().toUpperCase();

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

  return XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
  });
};

const buildImportPreview = (filePath) => {
  const rows = readExcelRows(filePath);

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

    if (isCategoryRow({ itemNo, title, retentionPeriod })) {
      currentCategory = itemNo;
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
      currentSeries = {
        rowNumber,
        type: "SERIES",
        itemNo,
        title,
        retentionPeriod: retentionPeriod || null,
        category: currentCategory,
        specifics: [],
      };

      parsed.push(currentSeries);

      if (currentCategory) {
        if (!categorySummary[currentCategory]) {
          categorySummary[currentCategory] = {
            name: currentCategory,
            totalSeries: 0,
            totalSpecifics: 0,
          };
        }

        categorySummary[currentCategory].totalSeries += 1;
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

const importPreviewToDatabase = async ({
  recordsScheduleId,
  departmentId,
  rdsYear,
  category,
  preview,
}) => {
  let importedSeries = 0;
  let skippedSeries = 0;

  let importedSpecifics = 0;
  let skippedSpecifics = 0;

  for (const seriesItem of preview.series) {
    const seriesCategory =
      seriesItem.category || category || null;

    const seriesRetentionPeriod =
      seriesItem.retentionPeriod || null;

    // Look for the same RDS entry first.
    const existingSeries = await Series.findOne({
      where: {
        RecordsScheduleID: recordsScheduleId,
        ItemNoID: seriesItem.itemNo,
        SeriesName: seriesItem.title,
        RetentionPeriod: seriesRetentionPeriod,
        RdsYear: rdsYear || null,
        Category: seriesCategory,
        DepartmentID: departmentId || null,
      },
    });

    let series;

    if (existingSeries) {
      series = existingSeries;
      skippedSeries += 1;
    } else {
      series = await Series.create({
        ItemNoID: seriesItem.itemNo,
        SeriesName: seriesItem.title,
        RetentionPeriod: seriesRetentionPeriod,
        RdsYear: rdsYear || null,
        Category: seriesCategory,
        RecordsScheduleID: recordsScheduleId,
        DepartmentID: departmentId || null,
      });

      importedSeries += 1;
    }

    // Specific records are also protected from duplicates.
    for (const specificItem of seriesItem.specifics) {
      const specificRetentionPeriod =
        specificItem.retentionPeriod ||
        seriesItem.retentionPeriod ||
        "";

      const existingSpecific = await Specific.findOne({
        where: {
          SeriesID: series.SeriesID,
          SpecificName: specificItem.title,
          RetentionPeriod: specificRetentionPeriod,
        },
      });

      if (existingSpecific) {
        skippedSpecifics += 1;
        continue;
      }

      await Specific.create({
        SeriesID: series.SeriesID,
        SpecificName: specificItem.title,
        RetentionPeriod: specificRetentionPeriod,
      });

      importedSpecifics += 1;
    }
  }

  return {
    importedSeries,
    skippedSeries,
    importedSpecifics,
    skippedSpecifics,
    totalProcessedSeries: preview.totalSeries,
    totalProcessedSpecifics: preview.totalSpecifics,
  };
};
module.exports = {
  buildImportPreview,
  importPreviewToDatabase,
};