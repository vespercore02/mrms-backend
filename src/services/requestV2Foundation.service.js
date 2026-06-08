const {
  RequestType,
  RequestFormType,
  RequestRequiredForm,
} = require("../models");

const getAllRequestTypes = async () => {
  return await RequestType.findAll({
    where: { Status: "ACTIVE" },
    include: [
      {
        model: RequestRequiredForm,
        where: { Status: "ACTIVE" },
        required: false,
        include: [RequestFormType],
      },
    ],
    order: [
      ["RequestTypeName", "ASC"],
      [RequestRequiredForm, "SortOrder", "ASC"],
    ],
  });
};

const getRequestTypeById = async (id) => {
  return await RequestType.findByPk(id, {
    include: [
      {
        model: RequestRequiredForm,
        where: { Status: "ACTIVE" },
        required: false,
        include: [RequestFormType],
      },
    ],
    order: [[RequestRequiredForm, "SortOrder", "ASC"]],
  });
};

const getRequestTypeByCode = async (code) => {
  return await RequestType.findOne({
    where: {
      RequestTypeCode: code,
      Status: "ACTIVE",
    },
    include: [
      {
        model: RequestRequiredForm,
        where: { Status: "ACTIVE" },
        required: false,
        include: [RequestFormType],
      },
    ],
    order: [[RequestRequiredForm, "SortOrder", "ASC"]],
  });
};

const getAllFormTypes = async () => {
  return await RequestFormType.findAll({
    where: { Status: "ACTIVE" },
    order: [
      ["FormCategory", "ASC"],
      ["FormName", "ASC"],
    ],
  });
};

const getRequiredFormsByRequestType = async (requestTypeId) => {
  return await RequestRequiredForm.findAll({
    where: {
      RequestTypeID: requestTypeId,
      Status: "ACTIVE",
    },
    include: [RequestType, RequestFormType],
    order: [["SortOrder", "ASC"]],
  });
};

module.exports = {
  getAllRequestTypes,
  getRequestTypeById,
  getRequestTypeByCode,
  getAllFormTypes,
  getRequiredFormsByRequestType,
};