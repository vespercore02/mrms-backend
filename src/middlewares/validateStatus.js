const allowedStatuses = [
  "DRAFT",
  "SUBMITTED",
  "DEPARTMENT_APPROVED",
  "RECEIVED",
  "UNDER_REVIEW",
  "FOR_COMPLIANCE",
  "RESUBMITTED",
  "APPROVED",
  "FOR_TRANSMITTAL",
  "RECEIVED_FOR_STORAGE",
  "STORAGE_ASSIGNED",
  "COMPLETED",
  "ARCHIVED",
  "REJECTED",
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