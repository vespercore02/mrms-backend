const cabinetBayService = require("../services/cabinetBay.service");

const getAllCabinetBays = async (req, res) => {
  try {
    const bays = await cabinetBayService.getAllCabinetBays(req.query);

    return res.status(200).json({
      success: true,
      data: bays,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cabinet bays",
      error: error.message,
    });
  }
};

const getCabinetBayById = async (req, res) => {
  try {
    const bay = await cabinetBayService.getCabinetBayById(req.params.id);

    if (!bay) {
      return res.status(404).json({
        success: false,
        message: "Cabinet bay not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: bay,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cabinet bay",
      error: error.message,
    });
  }
};

const createCabinetBay = async (req, res) => {
  try {
    const bay = await cabinetBayService.createCabinetBay(req.body);

    return res.status(201).json({
      success: true,
      message: "Cabinet bay created successfully",
      data: bay,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create cabinet bay",
    });
  }
};

const updateCabinetBay = async (req, res) => {
  try {
    const bay = await cabinetBayService.updateCabinetBay(
      req.params.id,
      req.body
    );

    if (!bay) {
      return res.status(404).json({
        success: false,
        message: "Cabinet bay not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cabinet bay updated successfully",
      data: bay,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update cabinet bay",
      error: error.message,
    });
  }
};

const updateCabinetBayStatus = async (req, res) => {
  try {
    const bay = await cabinetBayService.updateCabinetBayStatus(
      req.params.id,
      req.body.Status
    );

    if (!bay) {
      return res.status(404).json({
        success: false,
        message: "Cabinet bay not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cabinet bay status updated successfully",
      data: bay,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update cabinet bay status",
      error: error.message,
    });
  }
};

const deleteCabinetBay = async (req, res) => {
  try {
    const bay = await cabinetBayService.deleteCabinetBay(req.params.id);

    if (!bay) {
      return res.status(404).json({
        success: false,
        message: "Cabinet bay not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cabinet bay deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete cabinet bay",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCabinetBays,
  getCabinetBayById,
  createCabinetBay,
  updateCabinetBay,
  updateCabinetBayStatus,
  deleteCabinetBay,
};