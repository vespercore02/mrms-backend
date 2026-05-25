const filePathService = require('../services/filePath.service');
const path = require('path');
const fs = require('fs');
const { AgencyForm } = require('../models');
const getFileUrl = require('../utils/fileUrl');

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



const uploadFilePath = async (req, res) => {
  try {
    const { AgencyUniqueID } = req.body;

    if (!AgencyUniqueID) {
      if (req.file) fs.unlinkSync(req.file.path);

      return res.status(400).json({
        success: false,
        message: 'AgencyUniqueID is required',
      });
    }

    const agency = await AgencyForm.findByPk(AgencyUniqueID);

    if (!agency) {
      if (req.file) fs.unlinkSync(req.file.path);

      return res.status(404).json({
        success: false,
        message: 'Agency not found. Create agency form first.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const filePath = await filePathService.createFilePath({
      FilePathLocation: req.file.path,
      FilePathUniqueID: AgencyUniqueID,
    });

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: filePath.FilePathID,
        originalName: req.file.originalname,
        storedPath: req.file.path,
        url: getFileUrl(req, req.file.path),
        record: filePath,
      },
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);

    return res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message,
    });
  }
};


const viewFile = async (req, res) => {
  try {
    const filePath = await filePathService.getFilePathById(req.params.id);

    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: 'File record not found',
      });
    }

    const absolutePath = path.join(process.cwd(), filePath.FilePathLocation);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({
        success: false,
        message: 'Physical file not found',
      });
    }

    return res.sendFile(absolutePath);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to view file',
      error: error.message,
    });
  }
};

const downloadFile = async (req, res) => {
  try {
    const filePath = await filePathService.getFilePathById(req.params.id);

    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: 'File record not found',
      });
    }

    const absolutePath = path.join(process.cwd(), filePath.FilePathLocation);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({
        success: false,
        message: 'Physical file not found',
      });
    }

    return res.download(absolutePath);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to download file',
      error: error.message,
    });
  }
};

module.exports = {
  getAllFilePaths,
  getFilePathById,
  createFilePath,
  uploadFilePath,
  viewFile,
  downloadFile,
  updateFilePath,
  deleteFilePath,
};