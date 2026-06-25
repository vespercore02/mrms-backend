const createAuditLog = require("../utils/auditLogger");
const { canTransitionStatus } = require("../utils/workflowRules");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../utils/pagination");
const storageBoxService = require("./storageBox.service");

const CRO_VISIBLE_STATUSES = [
  "DEPARTMENT_APPROVED",
  "RECEIVED",
  "UNDER_REVIEW",
  "FOR_CRH_APPROVAL",
  "APPROVED",
  "FOR_TRANSMITTAL",
  "RECEIVED_FOR_STORAGE",
  "STORAGE_ASSIGNED",
  "COMPLETED",
];

const canUserAccessRequest = (request, user) => {
  const roleName = user?.Role?.RoleName;

  if (roleName === "Admin") return true;

  if (["Department Custodian", "Department Head"].includes(roleName)) {
    return Number(request.DepartmentID) === Number(user.DepartmentID);
  }

  if (["Records Officer", "Records Head"].includes(roleName)) {
    return CRO_VISIBLE_STATUSES.includes(request.Status);
  }

  return Number(request.RequestedBy) === Number(user?.UserID);
};

const {
  Request,
  RequestStatusHistory,
  User,
  AgencyForm,
  Department,
  RequestType,
  RequestRequiredForm,
  RequestForm,
  RequestFormType,
  Cabinet,
  CabinetBay,
  StorageBox,
  BoxRecord,
} = require("../models");

const allowedStatusTransitions = {
  DRAFT: ["SUBMITTED"],

  SUBMITTED: ["DEPARTMENT_APPROVED", "FOR_COMPLIANCE", "REJECTED"],

  DEPARTMENT_APPROVED: ["RECEIVED", "REJECTED"],

  RECEIVED: ["UNDER_REVIEW", "REJECTED"],

  UNDER_REVIEW: ["FOR_CRH_APPROVAL", "FOR_COMPLIANCE", "REJECTED"],

  FOR_COMPLIANCE: ["RESUBMITTED", "REJECTED"],

  RESUBMITTED: [
    "DEPARTMENT_APPROVED",
    "UNDER_REVIEW",
    "FOR_CRH_APPROVAL",
    "FOR_COMPLIANCE",
    "REJECTED",
  ],

  FOR_CRH_APPROVAL: ["APPROVED", "FOR_COMPLIANCE", "REJECTED"],

  APPROVED: ["FOR_TRANSMITTAL"],

  FOR_TRANSMITTAL: ["RECEIVED_FOR_STORAGE"],

  RECEIVED_FOR_STORAGE: ["STORAGE_ASSIGNED"],

  STORAGE_ASSIGNED: ["COMPLETED"],

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
      ["GENERATED", "SUBMITTED", "REVIEWED", "APPROVED"].includes(requestForm.Status);

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

const getAllRequests = async (query, user) => {
  const { page, limit, offset } = getPagination(query);

  const where = {};

  const roleName = user?.Role?.RoleName;
  const userId = user?.UserID;
  const departmentId = user?.DepartmentID;

  let allowedStatuses = null;

  if (roleName === "Admin") {
    // no filter
  } else if (roleName === "Department Custodian") {
    where.RequestedBy = userId;
  } else if (roleName === "Department Head") {
    where.DepartmentID = departmentId;
  } else if (["Records Officer", "Records Head"].includes(roleName)) {
    allowedStatuses = [
      "DEPARTMENT_APPROVED",
      "RECEIVED",
      "UNDER_REVIEW",
      "FOR_CRH_APPROVAL",
      "APPROVED",
      "FOR_TRANSMITTAL",
      "RECEIVED_FOR_STORAGE",
      "STORAGE_ASSIGNED",
      "COMPLETED",
    ];

    where.Status = {
      [Op.in]: allowedStatuses,
    };
  } else {
    where.RequestedBy = userId;
  }

  const isDepartmentUser = ["Department Head", "Department Custodian"].includes(
    roleName,
  );

  if (query.status) {
    if (allowedStatuses && !allowedStatuses.includes(query.status)) {
      where.Status = {
        [Op.in]: [],
      };
    } else {
      where.Status = query.status;
    }
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
      Department,
      AgencyForm,
      RequestStatusHistory,
      Cabinet,
      CabinetBay,
      StorageBox,
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
    distinct: true,
  });

  return getPagingData(result, page, limit);
};

const getRequestById = async (id, user) => {
  const request = await Request.findByPk(id, {
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
      Department,
      AgencyForm,
      {
        model: RequestStatusHistory,
        include: [
          {
            model: User,
            attributes: {
              exclude: ["Password"],
            },
          },
        ],
      },
      Cabinet,
      CabinetBay,
      StorageBox,
    ],
  });

  if (!request) {
    return null;
  }

  if (!canUserAccessRequest(request, user)) {
    const error = new Error("You are not allowed to view this request.");
    error.statusCode = 403;
    throw error;
  }

  

  return request;
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

  const requester = await User.findByPk(payload.RequestedBy);

  if (!requester) {
    const error = new Error("Requester not found");
    error.statusCode = 404;
    throw error;
  }

  const departmentId = payload.DepartmentID || requester.DepartmentID || null;

  if (!departmentId) {
    const error = new Error("Department is required for this request.");
    error.statusCode = 400;
    throw error;
  }

  const request = await Request.create({
    RequestCode: requestCode,
    RequestType: payload.RequestType,
    DepartmentID: departmentId,
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

  if (newStatus === "DEPARTMENT_APPROVED") {
    await RequestForm.update(
      {
        Status: "APPROVED",
        ApprovedBy: payload.ChangedBy,
      },
      {
        where: {
          RequestID: request.RequestID,
          Status: "SUBMITTED",
        },
      },
    );
  }

  return request;
};

const deleteRequest = async (id) => {
  const request = await Request.findByPk(id);

  if (!request) return null;

  await request.destroy();
  return request;
};

const assignStorageLocation = async (id, payload) => {
  const request = await Request.findByPk(id);

  if (!request) return null;

  if (request.Status !== "RECEIVED_FOR_STORAGE") {
    const error = new Error(
      "Storage can only be assigned when request is RECEIVED_FOR_STORAGE.",
    );
    error.statusCode = 400;
    throw error;
  }

  const occupiedRequest = await Request.findOne({
    where: {
      StorageBoxID: payload.StorageBoxID,
      RequestID: {
        [Op.ne]: id,
      },
      Status: {
        [Op.notIn]: ["REJECTED", "ARCHIVED"],
      },
    },
  });

  if (occupiedRequest) {
    const error = new Error(
      `Storage box is already assigned to request ${occupiedRequest.RequestCode}.`,
    );
    error.statusCode = 400;
    throw error;
  }

  const storageBox = await StorageBox.findByPk(payload.StorageBoxID, {
    include: [CabinetBay],
  });

  if (!storageBox) {
    const error = new Error(
      "Storage box not found. Please select a valid box.",
    );
    error.statusCode = 404;
    throw error;
  }

  if (Number(storageBox.CabinetBayID) !== Number(payload.CabinetBayID)) {
    const error = new Error(
      "Selected storage box does not belong to this cabinet bay.",
    );
    error.statusCode = 400;
    throw error;
  }

  if (storageBox.Status !== "AVAILABLE") {
    const error = new Error(
      `Storage box ${storageBox.BoxCode} is not available.`,
    );
    error.statusCode = 400;
    throw error;
  }

  await storageBox.update({
    Status: "OCCUPIED",
  });

  await request.update({
    CabinetID: payload.CabinetID || null,
    CabinetBayID: payload.CabinetBayID || null,
    StorageBoxID: payload.StorageBoxID || null,
  });

  await createAuditLog({
    action: "ASSIGN_STORAGE",
    tableName: "tblRequests",
    recordId: request.RequestID,
    oldValue: null,
    newValue: {
      CabinetID: payload.CabinetID,
      CabinetBayID: payload.CabinetBayID,
      StorageBoxID: payload.StorageBoxID,
    },
    performedBy: payload.AssignedBy,
  });

  console.log("Creating BoxRecord for request:", request.RequestID);

  const [boxRecord, created] = await BoxRecord.findOrCreate({
    where: {
      RequestID: request.RequestID,
      StorageBoxID: payload.StorageBoxID,
    },
    defaults: {
      RequestID: request.RequestID,
      StorageBoxID: payload.StorageBoxID,
      DataListID: null,
      Remarks: `Auto-created from request ${request.RequestCode}`,
    },
  });

  await storageBoxService.recomputeBayCapacity(payload.CabinetBayID);

  await request.update({
    Status: "STORAGE_ASSIGNED",
  });

  await RequestStatusHistory.create({
    RequestID: request.RequestID,
    OldStatus: "RECEIVED_FOR_STORAGE",
    NewStatus: "STORAGE_ASSIGNED",
    ChangedBy: payload.AssignedBy || null,
    Remarks: "Storage location assigned",
  });

  console.log("BoxRecord result:", {
    created,
    boxRecordId: boxRecord.BoxRecordID,
  });

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
  assignStorageLocation,
  BoxRecord,
};
