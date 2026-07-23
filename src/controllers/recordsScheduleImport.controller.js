const recordsScheduleImportService = require("../services/recordsScheduleImport.service");
const asyncHandler = require("../utils/asyncHandler");

const previewImport = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Excel file is required.",
    });
  }

  const preview = recordsScheduleImportService.buildImportPreview(
    req.file.path,
  );

  return res.status(200).json({
    success: true,
    data: preview,
  });
});

const confirmImport = asyncHandler(async (req, res) => {
  const { departmentId, rdsYear, category, preview } = req.body;

  if (!preview || !Array.isArray(preview.series)) {
    return res.status(400).json({
      success: false,
      message: "Valid preview data is required.",
    });
  }

  const result = await recordsScheduleImportService.importPreviewToDatabase({
    recordsScheduleId: req.params.id,
    departmentId,
    rdsYear,
    category,
    preview,
  });

  return res.status(201).json({
    success: true,
    message: "Records schedule imported successfully.",
    data: result,
  });
});

const importDirect = asyncHandler(async (req, res) => {
  const {  rdsYear, category } = req.body;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Excel file is required.",
    });
  }

  const preview = recordsScheduleImportService.buildImportPreview(
    req.file.path,
    category || null,
  );

  const result = await recordsScheduleImportService.importPreviewToDatabase({
    recordsScheduleId: req.params.id,
    rdsYear: rdsYear || null,
    category: category || null,
    preview,
  });

  return res.status(201).json({
    success: true,
    message: "Records schedule imported successfully.",
    data: {
      ...result,
      totalSkippedRows: preview.totalSkippedRows,
      categories: preview.categories,
    },
  });
});

module.exports = {
  previewImport,
  confirmImport,
  importDirect,
};
