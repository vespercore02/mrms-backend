const requestV2FoundationService = require("../services/requestV2Foundation.service");

const getAllRequestTypes = async (req, res) => {
  try {
    const data = await requestV2FoundationService.getAllRequestTypes();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch request types",
      error: error.message,
    });
  }
};

const getRequestTypeById = async (req, res) => {
  try {
    const data = await requestV2FoundationService.getRequestTypeById(
      req.params.id
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Request type not found",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch request type",
      error: error.message,
    });
  }
};

const getRequestTypeByCode = async (req, res) => {
  try {
    const data = await requestV2FoundationService.getRequestTypeByCode(
      req.params.code
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Request type not found",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch request type",
      error: error.message,
    });
  }
};

const getAllFormTypes = async (req, res) => {
  try {
    const data = await requestV2FoundationService.getAllFormTypes();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch form types",
      error: error.message,
    });
  }
};

const getRequiredFormsByRequestType = async (req, res) => {
  try {
    const data = await requestV2FoundationService.getRequiredFormsByRequestType(
      req.params.requestTypeId
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch required forms",
      error: error.message,
    });
  }
};

module.exports = {
  getAllRequestTypes,
  getRequestTypeById,
  getRequestTypeByCode,
  getAllFormTypes,
  getRequiredFormsByRequestType,
};