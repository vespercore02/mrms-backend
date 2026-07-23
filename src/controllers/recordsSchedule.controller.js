const recordsScheduleService = require(
  "../services/recordsSchedule.service",
);
const asyncHandler = require("../utils/asyncHandler");

const getAllRecordsSchedules = asyncHandler(async (req, res) => {
  const recordsSchedules =
    await recordsScheduleService.getAllRecordsSchedules(req.query);

  return res.status(200).json({
    success: true,
    data: recordsSchedules,
  });
});

const getRecordsScheduleById = asyncHandler(async (req, res) => {
  const recordsSchedule =
    await recordsScheduleService.getRecordsScheduleById(req.params.id);

  return res.status(200).json({
    success: true,
    data: recordsSchedule,
  });
});

const createRecordsSchedule = asyncHandler(async (req, res) => {
  const recordsSchedule =
    await recordsScheduleService.createRecordsSchedule(req.body);

  return res.status(201).json({
    success: true,
    message: "Records schedule created successfully",
    data: recordsSchedule,
  });
});

const updateRecordsSchedule = asyncHandler(async (req, res) => {
  const recordsSchedule =
    await recordsScheduleService.updateRecordsSchedule(
      req.params.id,
      req.body,
    );

  return res.status(200).json({
    success: true,
    message: "Records schedule updated successfully",
    data: recordsSchedule,
  });
});

const deactivateRecordsSchedule = asyncHandler(async (req, res) => {
  const recordsSchedule =
    await recordsScheduleService.deactivateRecordsSchedule(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Records schedule deactivated successfully",
    data: recordsSchedule,
  });
});

module.exports = {
  getAllRecordsSchedules,
  getRecordsScheduleById,
  createRecordsSchedule,
  updateRecordsSchedule,
  deactivateRecordsSchedule,
};