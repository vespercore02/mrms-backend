const storageBoxService = require("../services/storageBox.service");

const getAllStorageBoxes = async (req, res) => {
  try {
    const boxes = await storageBoxService.getAllStorageBoxes(req.query);

    return res.status(200).json({
      success: true,
      data: boxes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch storage boxes",
      error: error.message,
    });
  }
};

const getStorageBoxById = async (req, res) => {
  try {
    const box = await storageBoxService.getStorageBoxById(req.params.id);

    if (!box) {
      return res.status(404).json({
        success: false,
        message: "Storage box not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: box,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch storage box",
      error: error.message,
    });
  }
};

const createStorageBox = async (req, res) => {
  try {
    const box = await storageBoxService.createStorageBox(req.body);

    return res.status(201).json({
      success: true,
      message: "Storage box created successfully",
      data: box,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create storage box",
    });
  }
};

const updateStorageBox = async (req, res) => {
  try {
    const box = await storageBoxService.updateStorageBox(
      req.params.id,
      req.body
    );

    if (!box) {
      return res.status(404).json({
        success: false,
        message: "Storage box not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Storage box updated successfully",
      data: box,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update storage box",
    });
  }
};

const deleteStorageBox = async (req, res) => {
  try {
    const box = await storageBoxService.deleteStorageBox(req.params.id);

    if (!box) {
      return res.status(404).json({
        success: false,
        message: "Storage box not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Storage box deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete storage box",
      error: error.message,
    });
  }
};

module.exports = {
  getAllStorageBoxes,
  getStorageBoxById,
  createStorageBox,
  updateStorageBox,
  deleteStorageBox,
};