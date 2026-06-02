const {
  Request,
  Department,
  AgencyForm,
  FilePath,
  User,
  DataList,
  ArchiveRecord,
  ImportLog,
} = require("../models");

const getDashboardSummary = async () => {
  const [
    totalRequests,
    submittedRequests,
    receivedRequests,
    underReviewRequests,
    forComplianceRequests,
    resubmittedRequests,
    approvedRequests,
    completedRequests,
    archivedRequests,
    rejectedRequests,
    totalDepartments,
    totalAgencies,
    totalFiles,
    totalUsers,
    totalDataLists,
    totalArchiveRecords,
    forReviewArchives,
    forDisposalArchives,
    totalImportLogs,
  ] = await Promise.all([
    Request.count(),
    Request.count({ where: { Status: "SUBMITTED" } }),
    Request.count({ where: { Status: "RECEIVED" } }),
    Request.count({ where: { Status: "UNDER_REVIEW" } }),
    Request.count({ where: { Status: "FOR_COMPLIANCE" } }),
    Request.count({ where: { Status: "RESUBMITTED" } }),
    Request.count({ where: { Status: "APPROVED" } }),
    Request.count({ where: { Status: "COMPLETED" } }),
    Request.count({ where: { Status: "ARCHIVED" } }),
    Request.count({ where: { Status: "REJECTED" } }),
    Department.count(),
    AgencyForm.count(),
    FilePath.count(),
    User.count(),
    DataList.count(),
    ArchiveRecord.count(),
    ArchiveRecord.count({ where: { ArchiveStatus: "FOR_REVIEW" } }),
    ArchiveRecord.count({ where: { ArchiveStatus: "FOR_DISPOSAL" } }),
    ImportLog.count(),
  ]);

  return {
    totalRequests,
    requestStatus: {
      submitted: submittedRequests,
      received: receivedRequests,
      underReview: underReviewRequests,
      forCompliance: forComplianceRequests,
      resubmitted: resubmittedRequests,
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
      dataLists: totalDataLists,
      archiveRecords: totalArchiveRecords,
      importLogs: totalImportLogs,
    },
    archiveStatus: {
      forReview: forReviewArchives,
      forDisposal: forDisposalArchives,
    },
  };
};

module.exports = {
  getDashboardSummary,
};
