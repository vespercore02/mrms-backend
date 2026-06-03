const cabinetService = require("../services/cabinet.service");

const getAllCabinets = async (req, res) => {
  try {
    const cabinets = await cabinetService.getAllCabinets(req.query);

    return res.status(200).json({
      success: true,
      data: cabinets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cabinets",
      error: error.message,
    });
  }
};

const getCabinetById = async (req, res) => {
  try {
    const cabinet = await cabinetService.getCabinetById(req.params.id);

    if (!cabinet) {
      return res.status(404).json({
        success: false,
        message: "Cabinet not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: cabinet,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cabinet",
      error: error.message,
    });
  }
};

const getCabinetByCode = async (req, res) => {
  try {
    const cabinet = await cabinetService.getCabinetByCode(
      req.params.cabinetCode
    );

    if (!cabinet) {
      return res.status(404).json({
        success: false,
        message: "Cabinet not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: cabinet,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cabinet",
      error: error.message,
    });
  }
};

const createCabinet = async (req, res) => {
  try {
    const cabinet = await cabinetService.createCabinet(req.body);

    return res.status(201).json({
      success: true,
      message: "Cabinet created successfully",
      data: cabinet,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create cabinet",
      error: error.message,
    });
  }
};

const updateCabinet = async (req, res) => {
  try {
    const cabinet = await cabinetService.updateCabinet(req.params.id, req.body);

    if (!cabinet) {
      return res.status(404).json({
        success: false,
        message: "Cabinet not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cabinet updated successfully",
      data: cabinet,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update cabinet",
      error: error.message,
    });
  }
};

const deleteCabinet = async (req, res) => {
  try {
    const cabinet = await cabinetService.deleteCabinet(req.params.id);

    if (!cabinet) {
      return res.status(404).json({
        success: false,
        message: "Cabinet not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cabinet deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete cabinet",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCabinets,
  getCabinetById,
  getCabinetByCode,
  createCabinet,
  updateCabinet,
  deleteCabinet,
};