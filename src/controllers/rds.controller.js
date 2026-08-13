const rdsService = require("../services/rds.service");
const asyncHandler = require("../utils/asyncHandler");

const getAllRdsEntries = asyncHandler(async (req, res) => {
  const result = await rdsService.getAllRdsEntries(req.query);

  return res.status(200).json({
    success: true,
    data: result,
  });
});

const getRdsEntryById = asyncHandler(async (req, res) => {
  const result = await rdsService.getRdsEntryById(req.params.id);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "RDS entry not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: result,
  });
});

const getRdsFilters = asyncHandler(async (req, res) => {
  const result = await rdsService.getRdsFilters();

  return res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  getAllRdsEntries,
  getRdsEntryById,
  getRdsFilters,
};