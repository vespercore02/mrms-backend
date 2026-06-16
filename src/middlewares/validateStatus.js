const allowedStatuses = [
  "DRAFT",
  "SUBMITTED",
  "DEPARTMENT_APPROVED",
  "RECEIVED",
  "UNDER_REVIEW",
  "FOR_COMPLIANCE",
  "RESUBMITTED",
  "FOR_CRH_APPROVAL",
  "APPROVED",
  "FOR_TRANSMITTAL",
  "RECEIVED_FOR_STORAGE",
  "STORAGE_ASSIGNED",
  "REJECTED",
  "COMPLETED",
  "ARCHIVED",
];

const validateStatus = (req, res, next) => {
  const { Status } = req.body;

  if (!Status) {
    return res.status(400).json({
      success: false,
      message: "Status is required",
    });
  }

  if (!allowedStatuses.includes(Status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value",
      allowedStatuses,
    });
  }

  next();
};

module.exports = validateStatus;
