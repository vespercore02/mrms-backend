const requestService = require('../services/request.service');

const getAllRequests = async (req, res) => {
  try {
    const requests = await requestService.getAllRequests();

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch requests',
      error: error.message,
    });
  }
};

const getRequestById = async (req, res) => {
  try {
    const request = await requestService.getRequestById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch request',
      error: error.message,
    });
  }
};

const createRequest = async (req, res) => {
  try {
    const request = await requestService.createRequest(req.body);

    return res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create request',
      error: error.message,
    });
  }
};

const updateRequest = async (req, res) => {
  try {
    const request = await requestService.updateRequest(req.params.id, req.body);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Request updated successfully',
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update request',
      error: error.message,
    });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const request = await requestService.updateRequestStatus(
      req.params.id,
      req.body
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Request status updated successfully',
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update request status',
      error: error.message,
    });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const request = await requestService.deleteRequest(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Request deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete request',
      error: error.message,
    });
  }
};

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  updateRequestStatus,
  deleteRequest,
};