const filePathService = require('../services/filePath.service');

const getAllFilePaths = async (req, res) => {
  try {
    const filePaths = await filePathService.getAllFilePaths();

    return res.status(200).json({
      success: true,
      data: filePaths,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch file paths',
      error: error.message,
    });
  }
};

const getFilePathById = async (req, res) => {
  try {
    const filePath = await filePathService.getFilePathById(req.params.id);

    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: 'File path not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: filePath,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch file path',
      error: error.message,
    });
  }
};

const createFilePath = async (req, res) => {
  try {
    const filePath = await filePathService.createFilePath(req.body);

    return res.status(201).json({
      success: true,
      message: 'File path created successfully',
      data: filePath,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create file path',
      error: error.message,
    });
  }
};

const updateFilePath = async (req, res) => {
  try {
    const filePath = await filePathService.updateFilePath(req.params.id, req.body);

    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: 'File path not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'File path updated successfully',
      data: filePath,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update file path',
      error: error.message,
    });
  }
};

const deleteFilePath = async (req, res) => {
  try {
    const filePath = await filePathService.deleteFilePath(req.params.id);

    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: 'File path not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'File path deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete file path',
      error: error.message,
    });
  }
};

module.exports = {
  getAllFilePaths,
  getFilePathById,
  createFilePath,
  updateFilePath,
  deleteFilePath,
};