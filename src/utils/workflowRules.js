const workflowRules = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['RECEIVED', 'REJECTED'],
  RECEIVED: ['UNDER_REVIEW', 'FOR_COMPLIANCE', 'REJECTED'],
  UNDER_REVIEW: ['FOR_COMPLIANCE', 'APPROVED', 'REJECTED'],
  FOR_COMPLIANCE: ['SUBMITTED', 'REJECTED'],
  APPROVED: ['COMPLETED'],
  COMPLETED: ['ARCHIVED'],
  REJECTED: [],
  ARCHIVED: [],
};

const canTransitionStatus = (currentStatus, nextStatus) => {
  const allowedNextStatuses = workflowRules[currentStatus] || [];
  return allowedNextStatuses.includes(nextStatus);
};

module.exports = {
  workflowRules,
  canTransitionStatus,
};