const allowedStatuses = [
  'DRAFT',
  'SUBMITTED',
  'RECEIVED',
  'UNDER_REVIEW',
  'FOR_COMPLIANCE',
  'APPROVED',
  'REJECTED',
  'COMPLETED',
  'ARCHIVED',
];

const validateStatus = (req, res, next) => {
  const { Status } = req.body;

  if (!Status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required',
    });
  }

  if (!allowedStatuses.includes(Status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status value',
      allowedStatuses,
    });
  }

  next();
};

module.exports = validateStatus;