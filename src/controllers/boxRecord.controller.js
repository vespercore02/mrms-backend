const boxRecordService = require("../services/boxRecord.service");

const getAllBoxRecords = async (req, res) => {
  try {
    const records = await boxRecordService.getAllBoxRecords(req.query);

    return res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch box records",
      error: error.message,
    });
  }
};

const getBoxRecordById = async (req, res) => {
  try {
    const record = await boxRecordService.getBoxRecordById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Box record not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch box record",
      error: error.message,
    });
  }
};

const assignDataListToBox = async (req, res) => {
  try {
    const record = await boxRecordService.assignDataListToBox(req.body);

    return res.status(201).json({
      success: true,
      message: "Data list record assigned to box successfully",
      data: record,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to assign data list record to box",
    });
  }
};

const updateBoxRecord = async (req, res) => {
  try {
    const record = await boxRecordService.updateBoxRecord(
      req.params.id,
      req.body
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Box record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Box record updated successfully",
      data: record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update box record",
      error: error.message,
    });
  }
};

const deleteBoxRecord = async (req, res) => {
  try {
    const record = await boxRecordService.deleteBoxRecord(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Box record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Box record removed from box successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove box record",
      error: error.message,
    });
  }
};

module.exports = {
  getAllBoxRecords,
  getBoxRecordById,
  assignDataListToBox,
  updateBoxRecord,
  deleteBoxRecord,
};