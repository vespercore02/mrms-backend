const requestFormService = require("../services/requestForm.service");

const getAllRequestForms = async (req, res) => {
  try {
    const data = await requestFormService.getAllRequestForms(req.query);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch request forms",
      error: error.message,
    });
  }
};

const getRequestFormById = async (req, res) => {
  try {
    const data = await requestFormService.getRequestFormById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Request form not found",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch request form",
      error: error.message,
    });
  }
};

const createRequestForm = async (req, res) => {
  try {
    const data = await requestFormService.createRequestForm(req.body);

    return res.status(201).json({
      success: true,
      message: "Request form created successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create request form",
    });
  }
};

const updateRequestForm = async (req, res) => {
  try {
    const data = await requestFormService.updateRequestForm(
      req.params.id,
      req.body
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Request form not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request form updated successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update request form",
    });
  }
};

const submitRequestForm = async (req, res) => {
  try {
    const userId = req.user?.UserID;

    const data = await requestFormService.submitRequestForm(
      req.params.id,
      userId
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Request form not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request form submitted successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit request form",
      error: error.message,
    });
  }
};

const reviewRequestForm = async (req, res) => {
  try {
    const userId = req.user?.UserID;

    const data = await requestFormService.reviewRequestForm(
      req.params.id,
      userId
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Request form not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request form reviewed successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to review request form",
      error: error.message,
    });
  }
};

const approveRequestForm = async (req, res) => {
  try {
    const userId = req.user?.UserID;

    const data = await requestFormService.approveRequestForm(
      req.params.id,
      userId
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Request form not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request form approved successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to approve request form",
      error: error.message,
    });
  }
};

const deleteRequestForm = async (req, res) => {
  try {
    const data = await requestFormService.deleteRequestForm(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Request form not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request form deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete request form",
      error: error.message,
    });
  }
};

module.exports = {
  getAllRequestForms,
  getRequestFormById,
  createRequestForm,
  updateRequestForm,
  submitRequestForm,
  reviewRequestForm,
  approveRequestForm,
  deleteRequestForm,
};