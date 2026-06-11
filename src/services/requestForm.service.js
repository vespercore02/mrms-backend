const {
  RequestForm,
  Request,
  RequestFormType,
  User,
  RequestRequiredForm,
} = require("../models");

const getAllRequestForms = async (query = {}) => {
  const where = {};

  if (query.requestId) {
    where.RequestID = query.requestId;
  }

  if (query.formTypeId) {
    where.RequestFormTypeID = query.formTypeId;
  }

  if (query.status) {
    where.Status = query.status;
  }

  const requestForms = await RequestForm.findAll({
    where,
    include: [
      Request,
      RequestFormType,
      {
        model: User,
        as: "PreparedUser",
        attributes: { exclude: ["Password"] },
      },
      {
        model: User,
        as: "ReviewedUser",
        attributes: { exclude: ["Password"] },
      },
      {
        model: User,
        as: "ApprovedUser",
        attributes: { exclude: ["Password"] },
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const plainForms = requestForms.map((form) => form.toJSON());

  const requestTypeIds = [
    ...new Set(
      plainForms
        .map((form) => form.Request?.RequestTypeID)
        .filter(Boolean)
    ),
  ];

  const requiredForms = await RequestRequiredForm.findAll({
    where: {
      RequestTypeID: requestTypeIds,
      Status: "ACTIVE",
    },
  });

  const requiredFormMap = {};

  requiredForms.forEach((item) => {
    const key = `${item.RequestTypeID}-${item.RequestFormTypeID}`;
    requiredFormMap[key] = item.toJSON();
  });

  return plainForms.map((form) => {
    const key = `${form.Request?.RequestTypeID}-${form.RequestFormTypeID}`;
    const requiredForm = requiredFormMap[key];

    return {
      ...form,
      RequirementType: requiredForm?.RequirementType || "OPTIONAL",
      TriggerCondition: requiredForm?.TriggerCondition || null,
      SortOrder: requiredForm?.SortOrder || null,
    };
  });
};

const getRequestFormById = async (id) => {
  return await RequestForm.findByPk(id, {
    include: [
      Request,
      RequestFormType,
      {
        model: User,
        as: "PreparedUser",
        attributes: { exclude: ["Password"] },
      },
      {
        model: User,
        as: "ReviewedUser",
        attributes: { exclude: ["Password"] },
      },
      {
        model: User,
        as: "ApprovedUser",
        attributes: { exclude: ["Password"] },
      },
    ],
  });
};

const createRequestForm = async (payload) => {
  const request = await Request.findByPk(payload.RequestID);

  if (!request) {
    const error = new Error("Request not found");
    error.statusCode = 404;
    throw error;
  }

  const formType = await RequestFormType.findByPk(payload.RequestFormTypeID);

  if (!formType) {
    const error = new Error("Request form type not found");
    error.statusCode = 404;
    throw error;
  }

  const existingForm = await RequestForm.findOne({
    where: {
      RequestID: payload.RequestID,
      RequestFormTypeID: payload.RequestFormTypeID,
    },
  });

  if (existingForm) {
    const error = new Error("This form already exists for this request");
    error.statusCode = 400;
    throw error;
  }

  const requestForm = await RequestForm.create({
    RequestID: payload.RequestID,
    RequestFormTypeID: payload.RequestFormTypeID,
    FormData: payload.FormData || null,
    Status: payload.Status || "DRAFT",
    PreparedBy: payload.PreparedBy || null,
    ReviewedBy: payload.ReviewedBy || null,
    ApprovedBy: payload.ApprovedBy || null,
    Remarks: payload.Remarks || null,
  });

  return await getRequestFormById(requestForm.RequestFormID);
};

const updateRequestForm = async (id, payload) => {
  const requestForm = await RequestForm.findByPk(id);

  if (!requestForm) return null;

  await requestForm.update({
    FormData: payload.FormData ?? requestForm.FormData,
    Status: payload.Status ?? requestForm.Status,
    PreparedBy: payload.PreparedBy ?? requestForm.PreparedBy,
    ReviewedBy: payload.ReviewedBy ?? requestForm.ReviewedBy,
    ApprovedBy: payload.ApprovedBy ?? requestForm.ApprovedBy,
    Remarks: payload.Remarks ?? requestForm.Remarks,
  });

  return await getRequestFormById(id);
};

const submitRequestForm = async (id, userId) => {
  const requestForm = await RequestForm.findByPk(id);

  if (!requestForm) return null;

  await requestForm.update({
    Status: "SUBMITTED",
    PreparedBy: userId || requestForm.PreparedBy,
  });

  return await getRequestFormById(id);
};

const reviewRequestForm = async (id, userId) => {
  const requestForm = await RequestForm.findByPk(id);

  if (!requestForm) return null;

  await requestForm.update({
    Status: "REVIEWED",
    ReviewedBy: userId || requestForm.ReviewedBy,
  });

  return await getRequestFormById(id);
};

const approveRequestForm = async (id, userId) => {
  const requestForm = await RequestForm.findByPk(id);

  if (!requestForm) return null;

  await requestForm.update({
    Status: "APPROVED",
    ApprovedBy: userId || requestForm.ApprovedBy,
  });

  return await getRequestFormById(id);
};

const deleteRequestForm = async (id) => {
  const requestForm = await RequestForm.findByPk(id);

  if (!requestForm) return null;

  await requestForm.destroy();

  return requestForm;
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
