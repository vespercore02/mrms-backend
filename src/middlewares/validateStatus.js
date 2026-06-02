const allowedStatuses = [
  "SUBMITTED",
  "RECEIVED",
  "UNDER_REVIEW",
  "FOR_COMPLIANCE",
  "RESUBMITTED",
  "NOTICE_OF_INSPECTION",
  "INSPECTION_DONE",
  "APPROVED",
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