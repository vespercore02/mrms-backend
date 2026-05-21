const seriesService = require('../services/series.service');

const getAllSeries = async (req, res) => {
  try {
    const series = await seriesService.getAllSeries();

    return res.status(200).json({
      success: true,
      data: series,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch series',
      error: error.message,
    });
  }
};

const getSeriesById = async (req, res) => {
  try {
    const series = await seriesService.getSeriesById(req.params.id);

    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: series,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch series',
      error: error.message,
    });
  }
};

const createSeries = async (req, res) => {
  try {
    const series = await seriesService.createSeries(req.body);

    return res.status(201).json({
      success: true,
      message: 'Series created successfully',
      data: series,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create series',
      error: error.message,
    });
  }
};

const updateSeries = async (req, res) => {
  try {
    const series = await seriesService.updateSeries(req.params.id, req.body);

    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Series updated successfully',
      data: series,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update series',
      error: error.message,
    });
  }
};

const deleteSeries = async (req, res) => {
  try {
    const series = await seriesService.deleteSeries(req.params.id);

    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Series deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete series',
      error: error.message,
    });
  }
};

module.exports = {
  getAllSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
};