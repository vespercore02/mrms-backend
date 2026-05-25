const createAuditLog = require('../utils/auditLogger');
const { canTransitionStatus } = require('../utils/workflowRules');

const {
  Request,
  RequestStatusHistory,
  User,
  AgencyForm,
} = require('../models');

const generateRequestCode = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);

  return `REQ-${y}${m}${d}-${random}`;
};

const getAllRequests = async () => {
  return await Request.findAll({
    include: [
      {
        model: User,
        as: 'requester',
        attributes: { exclude: ['Password'] },
      },
      AgencyForm,
      RequestStatusHistory,
    ],
    order: [['createdAt', 'DESC']],
  });
};

const getRequestById = async (id) => {
  return await Request.findByPk(id, {
    include: [
      {
        model: User,
        as: 'requester',
        attributes: { exclude: ['Password'] },
      },
      AgencyForm,
      RequestStatusHistory,
    ],
  });
};

const createRequest = async (payload) => {
  const requestCode = generateRequestCode();

  const request = await Request.create({
    RequestCode: requestCode,
    RequestType: payload.RequestType,
    AgencyUniqueID: payload.AgencyUniqueID,
    RequestedBy: payload.RequestedBy,
    Status: payload.Status || 'SUBMITTED',
    Remarks: payload.Remarks,
  });

  await RequestStatusHistory.create({
    RequestID: request.RequestID,
    OldStatus: null,
    NewStatus: request.Status,
    ChangedBy: payload.RequestedBy,
    Remarks: 'Request created',
  });

  await createAuditLog({
  action: 'CREATE',
  tableName: 'tblRequests',
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
    const error = new Error(`Invalid status transition: ${oldStatus} to ${newStatus}`);
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
    action: 'STATUS_UPDATE',
    tableName: 'tblRequests',
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
};