const createAuditLog = require("../utils/auditLogger");
const { canTransitionStatus } = require("../utils/workflowRules");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../utils/pagination");

const {
  Request,
  RequestStatusHistory,
  User,
  AgencyForm,
  RequestType,
  RequestRequiredForm,
  RequestForm,
  RequestFormType,
} = require("../models");

const allowedStatusTransitions = {
  DRAFT: ["SUBMITTED"],
  SUBMITTED: ["RECEIVED", "REJECTED"],
  RECEIVED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["FOR_COMPLIANCE", "APPROVED", "REJECTED"],
  FOR_COMPLIANCE: ["RESUBMITTED", "REJECTED"],
  RESUBMITTED: ["UNDER_REVIEW", "APPROVED", "REJECTED"],
  APPROVED: ["COMPLETED"],
  COMPLETED: ["ARCHIVED"],
  REJECTED: ["RESUBMITTED"],
  ARCHIVED: [],
};

const validateStatusTransition = (currentStatus, nextStatus) => {
  const allowedNextStatuses = allowedStatusTransitions[currentStatus] || [];

  if (!allowedNextStatuses.includes(nextStatus)) {
    const error = new Error(
      `Invalid status transition from ${currentStatus} to ${nextStatus}`,
    );
    error.statusCode = 400;
    throw error;
  }
};

const validateRequiredFormsBeforeSubmit = async (request) => {
  if (!request.RequestTypeID) {
    const error = new Error("Request type is required before submitting.");
    error.statusCode = 400;
    throw error;
  }

  const requiredForms = await RequestRequiredForm.findAll({
    where: {
      RequestTypeID: request.RequestTypeID,
      RequirementType: "REQUIRED",
      Status: "ACTIVE",
    },
    include: [RequestFormType],
    order: [["SortOrder", "ASC"]],
  });

  if (requiredForms.length === 0) {
    return;
  }

  const missingOrIncompleteForms = [];

  for (const requiredForm of requiredForms) {
    const requestForm = await RequestForm.findOne({
      where: {
        RequestID: request.RequestID,
        RequestFormTypeID: requiredForm.RequestFormTypeID,
      },
    });

    const isCompleted =
      requestForm &&
      ["SUBMITTED", "REVIEWED", "APPROVED"].includes(requestForm.Status);

    if (!isCompleted) {
      missingOrIncompleteForms.push(
        requiredForm.RequestFormType?.FormCode || "Unknown Form",
      );
    }
  }

  if (missingOrIncompleteForms.length > 0) {
    const error = new Error(
      `Complete required forms before submitting: ${missingOrIncompleteForms.join(
        ", ",
      )}`,
    );
    error.statusCode = 400;
    throw error;
  }
};

const submitDraftRequest = async (id, userId) => {
  const request = await Request.findByPk(id);

  if (!request) return null;

  validateStatusTransition(request.Status, "SUBMITTED");

  await validateRequiredFormsBeforeSubmit(request);

  await request.update({
    Status: "SUBMITTED",
  });

  await RequestStatusHistory.create({
    RequestID: request.RequestID,
    OldStatus: "DRAFT",
    NewStatus: "SUBMITTED",
    ChangedBy: userId || null,
    Remarks: "Draft request submitted",
  });

  return request;
};
const generateRequestCode = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);

  return `REQ-${y}${m}${d}-${random}`;
};

const getAllRequests = async (query) => {
  const { page, limit, offset } = getPagination(query);

  const where = {};

  if (query.status) {
    where.Status = query.status;
  }

  if (query.requestType) {
    where.RequestType = {
      [Op.like]: `%${query.requestType}%`,
    };
  }

  if (query.search) {
    where[Op.or] = [
      { RequestCode: { [Op.like]: `%${query.search}%` } },
      { RequestType: { [Op.like]: `%${query.search}%` } },
      { Remarks: { [Op.like]: `%${query.search}%` } },
    ];
  }

  const result = await Request.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: "requester",
        attributes: { exclude: ["Password"] },
      },
      {
        model: RequestType,
        as: "RequestTypeInfo",
      },
      AgencyForm,
      RequestStatusHistory,
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
    distinct: true,
  });

  return getPagingData(result, page, limit);
};

const getRequestById = async (id) => {
  return await Request.findByPk(id, {
    include: [
      {
        model: User,
        as: "requester",
        attributes: { exclude: ["Password"] },
      },
      {
        model: RequestType,
        as: "RequestTypeInfo",
      },
      AgencyForm,
      RequestStatusHistory,
    ],
  });
};

const createRequiredFormsForRequest = async (request) => {
  if (!request.RequestTypeID) return;

  const requiredForms = await RequestRequiredForm.findAll({
    where: {
      RequestTypeID: request.RequestTypeID,
      Status: "ACTIVE",
    },
    include: [RequestFormType],
    order: [["SortOrder", "ASC"]],
  });

  for (const requiredForm of requiredForms) {
    if (requiredForm.RequirementType !== "REQUIRED") {
      continue;
    }

    await RequestForm.findOrCreate({
      where: {
        RequestID: request.RequestID,
        RequestFormTypeID: requiredForm.RequestFormTypeID,
      },
      defaults: {
        RequestID: request.RequestID,
        RequestFormTypeID: requiredForm.RequestFormTypeID,
        FormData: null,
        Status: "DRAFT",
        PreparedBy: request.RequestedBy || null,
        Remarks: `Auto-created ${requiredForm.RequestFormType?.FormCode || "request form"}`,
      },
    });
  }
};

const createRequest = async (payload) => {
  const requestCode = generateRequestCode();

  const request = await Request.create({
    RequestCode: requestCode,
    RequestType: payload.RequestType,
    AgencyUniqueID: payload.AgencyUniqueID,
    RequestedBy: payload.RequestedBy,
    RequestTypeID: payload.RequestTypeID || null,
    Status: payload.Status || "DRAFT",
    Remarks: payload.Remarks,
  });

  await createRequiredFormsForRequest(request);

  await RequestStatusHistory.create({
    RequestID: request.RequestID,
    OldStatus: null,
    NewStatus: request.Status,
    ChangedBy: payload.RequestedBy,
    Remarks: "Request created",
  });

  await createAuditLog({
    action: "CREATE",
    tableName: "tblRequests",
    recordId: request.RequestID,
    oldValue: null,
    newValue: request.toJSON(),
    performedBy: payload.RequestedBy,
  });

  return request;
};

const updateRequest = async (id, payload) => {
  const request = await Request.findByPk(id);

  if (!request) return null;

  await request.update(payload);
  return request;
};

const updateRequestStatus = async (id, payload) => {
  const request = await Request.findByPk(id);

  if (!request) return null;

  const oldStatus = request.Status;
  const newStatus = payload.Status;

  const isAllowed = canTransitionStatus(oldStatus, newStatus);

  if (!isAllowed) {
    const error = new Error(
      `Invalid status transition: ${oldStatus} to ${newStatus}`,
    );
    error.statusCode = 400;
    throw error;
  }

  await request.update({
    Status: newStatus,
    Remarks: payload.Remarks || request.Remarks,
  });

  await RequestStatusHistory.create({
    RequestID: request.RequestID,
    OldStatus: oldStatus,
    NewStatus: newStatus,
    ChangedBy: payload.ChangedBy,
    Remarks: payload.Remarks,
  });

  await createAuditLog({
    action: "STATUS_UPDATE",
    tableName: "tblRequests",
    recordId: request.RequestID,
    oldValue: {
      Status: oldStatus,
    },
    newValue: {
      Status: newStatus,
      Remarks: payload.Remarks,
    },
    performedBy: payload.ChangedBy,
  });

  return request;
};

const deleteRequest = async (id) => {
  const request = await Request.findByPk(id);

  if (!request) return null;

  await request.destroy();
  return request;
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
