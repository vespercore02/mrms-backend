const workflowRules = {
  SUBMITTED: ["RECEIVED"],

  RECEIVED: ["UNDER_REVIEW"],

  UNDER_REVIEW: [
    "FOR_COMPLIANCE",
    "NOTICE_OF_INSPECTION",
    "APPROVED",
    "REJECTED",
  ],

  FOR_COMPLIANCE: ["RESUBMITTED", "REJECTED"],

  REJECTED: ["RESUBMITTED"],

  RESUBMITTED: ["UNDER_REVIEW"],

  NOTICE_OF_INSPECTION: ["INSPECTION_DONE"],

  INSPECTION_DONE: ["APPROVED", "REJECTED"],

  APPROVED: ["COMPLETED"],

  COMPLETED: ["ARCHIVED"],

  ARCHIVED: [],
};

const canTransitionStatus = (oldStatus, newStatus) => {
  if (!workflowRules[oldStatus]) return false;

  return workflowRules[oldStatus].includes(newStatus);
};

module.exports = {
  workflowRules,
  canTransitionStatus,
};