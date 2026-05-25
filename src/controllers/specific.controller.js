const specificService = require('../services/specific.service');

const getAllSpecifics = async (req, res) => {
  try {
    const specifics = await specificService.getAllSpecifics(req.query);

    return res.status(200).json({
      success: true,
      data: specifics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch specifics',
      error: error.message,
    });
  }
};

const getSpecificById = async (req, res) => {
  try {
    const specific = await specificService.getSpecificById(req.params.id);

    if (!specific) {
      return res.status(404).json({
        success: false,
        message: 'Specific record not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: specific,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch specific record',
      error: error.message,
    });
  }
};

const createSpecific = async (req, res) => {
  try {
    const specific = await specificService.createSpecific(req.body);

    return res.status(201).json({
      success: true,
      message: 'Specific record created successfully',
      data: specific,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create specific record',
      error: error.message,
    });
  }
};

const updateSpecific = async (req, res) => {
  try {
    const specific = await specificService.updateSpecific(req.params.id, req.body);

    if (!specific) {
      return res.status(404).json({
        success: false,
        message: 'Specific record not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Specific record updated successfully',
      data: specific,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update specific record',
      error: error.message,
    });
  }
};

const deleteSpecific = async (req, res) => {
  try {
    const specific = await specificService.deleteSpecific(req.params.id);

    if (!specific) {
      return res.status(404).json({
        success: false,
        message: 'Specific record not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Specific record deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete specific record',
      error: error.message,
    });
  }
};

module.exports = {
  getAllSpecifics,
  getSpecificById,
  createSpecific,
  updateSpecific,
  deleteSpecific,
};