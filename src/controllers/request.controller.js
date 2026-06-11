const requestService = require("../services/request.service");
const asyncHandler = require("../utils/asyncHandler");

const getAllRequests = asyncHandler(async (req, res) => {
  const requests = await requestService.getAllRequests(req.query, req.user);

  return res.status(200).json({
    success: true,
    data: requests,
  });
});

const getRequestById = asyncHandler(async (req, res) => {
  const request = await requestService.getRequestById(
  req.params.id,
  req.user
);

  if (!request) {
    const error = new Error("Request not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    data: request,
  });
});

const createRequest = asyncHandler(async (req, res) => {
  const request = await requestService.createRequest(req.body);

  return res.status(201).json({
    success: true,
    message: "Request created successfully",
    data: request,
  });
});

const updateRequest = asyncHandler(async (req, res) => {
  const request = await requestService.updateRequest(req.params.id, req.body);

  if (!request) {
    const error = new Error("Request not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Request updated successfully",
    data: request,
  });
});

const updateRequestStatus = asyncHandler(async (req, res) => {
  const request = await requestService.updateRequestStatus(
    req.params.id,
    req.body,
  );

  if (!request) {
    const error = new Error("Request not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Request status updated successfully",
    data: request,
  });
});

const deleteRequest = asyncHandler(async (req, res) => {
  const request = await requestService.deleteRequest(req.params.id);

  if (!request) {
    const error = new Error("Request not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Request deleted successfully",
  });
});

const submitDraftRequest = async (req, res) => {
  try {
    const userId = req.user?.UserID;

    const request = await requestService.submitDraftRequest(
      req.params.id,
      userId,
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Draft request submitted successfully",
      data: request,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to submit request",
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
  submitDraftRequest,
};
