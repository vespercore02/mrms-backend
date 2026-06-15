const allowedTransitions = {
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

const canTransitionStatus = (currentStatus, nextStatus) => {
  const allowedNextStatuses = allowedTransitions[currentStatus] || [];
  return allowedNextStatuses.includes(nextStatus);
};

module.exports = {
  canTransitionStatus,
};