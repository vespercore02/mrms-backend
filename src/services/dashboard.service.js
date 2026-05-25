const {
  Request,
  Department,
  AgencyForm,
  FilePath,
  User,
} = require('../models');

const getDashboardSummary = async () => {
  const [
    totalRequests,
    submittedRequests,
    receivedRequests,
    underReviewRequests,
    forComplianceRequests,
    approvedRequests,
    completedRequests,
    archivedRequests,
    rejectedRequests,
    totalDepartments,
    totalAgencies,
    totalFiles,
    totalUsers,
  ] = await Promise.all([
    Request.count(),
    Request.count({ where: { Status: 'SUBMITTED' } }),
    Request.count({ where: { Status: 'RECEIVED' } }),
    Request.count({ where: { Status: 'UNDER_REVIEW' } }),
    Request.count({ where: { Status: 'FOR_COMPLIANCE' } }),
    Request.count({ where: { Status: 'APPROVED' } }),
    Request.count({ where: { Status: 'COMPLETED' } }),
    Request.count({ where: { Status: 'ARCHIVED' } }),
    Request.count({ where: { Status: 'REJECTED' } }),
    Department.count(),
    AgencyForm.count(),
    FilePath.count(),
    User.count(),
  ]);

  return {
    totalRequests,
    requestStatus: {
      submitted: submittedRequests,
      received: receivedRequests,
      underReview: underReviewRequests,
      forCompliance: forComplianceRequests,
      approved: approvedRequests,
      completed: completedRequests,
      archived: archivedRequests,
      rejected: rejectedRequests,
    },
    totals: {
      departments: totalDepartments,
      agencies: totalAgencies,
      files: totalFiles,
      users: totalUsers,
    },
  };
};

module.exports = {
  getDashboardSummary,
};