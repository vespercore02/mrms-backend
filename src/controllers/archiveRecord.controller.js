const archiveRecordService = require('../services/archiveRecord.service');

const getAllArchiveRecords = async (req, res) => {
  try {
    const archiveRecords = await archiveRecordService.getAllArchiveRecords();

    return res.status(200).json({
      success: true,
      data: archiveRecords,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch archive records',
      error: error.message,
    });
  }
};

const getArchiveRecordById = async (req, res) => {
  try {
    const archiveRecord = await archiveRecordService.getArchiveRecordById(
      req.params.id
    );

    if (!archiveRecord) {
      return res.status(404).json({
        success: false,
        message: 'Archive record not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: archiveRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch archive record',
      error: error.message,
    });
  }
};

const createArchiveRecord = async (req, res) => {
  try {
    const archiveRecord = await archiveRecordService.createArchiveRecord(
      req.body
    );

    return res.status(201).json({
      success: true,
      message: 'Archive record created successfully',
      data: archiveRecord,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to create archive record',
    });
  }
};

const updateArchiveStatus = async (req, res) => {
  try {
    const archiveRecord = await archiveRecordService.updateArchiveStatus(
      req.params.id,
      req.body
    );

    if (!archiveRecord) {
      return res.status(404).json({
        success: false,
        message: 'Archive record not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Archive status updated successfully',
      data: archiveRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update archive status',
      error: error.message,
    });
  }
};

const deleteArchiveRecord = async (req, res) => {
  try {
    const archiveRecord = await archiveRecordService.deleteArchiveRecord(
      req.params.id
    );

    if (!archiveRecord) {
      return res.status(404).json({
        success: false,
        message: 'Archive record not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Archive record deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete archive record',
      error: error.message,
    });
  }
};

module.exports = {
  getAllArchiveRecords,
  getArchiveRecordById,
  createArchiveRecord,
  updateArchiveStatus,
  deleteArchiveRecord,
};