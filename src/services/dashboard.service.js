const {
  Request,
  Department,
  AgencyForm,
  FilePath,
  User,
  DataList,
  ArchiveRecord,
  ImportLog,
  Cabinet,
  CabinetBay,
  StorageBox,
  BoxRecord,
} = require("../models");

const { Op } = require("sequelize");

const CRO_VISIBLE_STATUSES = [
  "DEPARTMENT_APPROVED",
  "RECEIVED",
  "UNDER_REVIEW",
  "FOR_CRH_APPROVAL",
  "APPROVED",
  "FOR_TRANSMITTAL",
  "RECEIVED_FOR_STORAGE",
  "STORAGE_ASSIGNED",
  "COMPLETED",
];

const buildRequestVisibilityWhere = (user) => {
  const where = {};

  const roleName = user?.Role?.RoleName;
  const userId = user?.UserID;
  const departmentId = user?.DepartmentID;

  if (roleName === "Admin") {
    return where;
  }

  if (roleName === "Department Custodian") {
    where.RequestedBy = userId;
    return where;
  }

  if (roleName === "Department Head") {
    where.DepartmentID = departmentId;
    return where;
  }

  if (["Records Officer", "Records Head"].includes(roleName)) {
    where.Status = {
      [Op.in]: CRO_VISIBLE_STATUSES,
    };
    return where;
  }

  where.RequestedBy = userId;
  return where;
};

const getDashboardSummary = async (user) => {
  const requestWhere = buildRequestVisibilityWhere(user);

  const statusWhere = (status) => ({
    ...requestWhere,
    Status: status,
  });
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
    totalCabinets,
    totalCabinetBays,
    availableBays,
    nearFullBays,
    fullBays,
    overweightBays,
    maintenanceBays,
    totalStorageBoxes,
    totalBoxRecords,
    draftRequests,
    departmentApprovedRequests,
    forCrhApprovalRequests,
    receivedForStorageRequests,
    storageAssignedRequests,
  ] = await Promise.all([
    Request.count({ where: requestWhere }),
    Request.count({ where: statusWhere("SUBMITTED") }),
    Request.count({ where: statusWhere("RECEIVED") }),
    Request.count({ where: statusWhere("UNDER_REVIEW") }),
    Request.count({ where: statusWhere("FOR_COMPLIANCE") }),
    Request.count({ where: statusWhere("RESUBMITTED") }),
    Request.count({ where: statusWhere("APPROVED") }),
    Request.count({ where: statusWhere("COMPLETED") }),
    Request.count({ where: statusWhere("ARCHIVED") }),
    Request.count({ where: statusWhere("REJECTED") }),
    Department.count(),
    AgencyForm.count(),
    FilePath.count(),
    User.count(),
    DataList.count(),
    ArchiveRecord.count(),
    ArchiveRecord.count({ where: { ArchiveStatus: "FOR_REVIEW" } }),
    ArchiveRecord.count({ where: { ArchiveStatus: "FOR_DISPOSAL" } }),
    ImportLog.count(),
    Cabinet.count(),
    CabinetBay.count(),
    CabinetBay.count({ where: { Status: "AVAILABLE" } }),
    CabinetBay.count({ where: { Status: "NEAR_FULL" } }),
    CabinetBay.count({ where: { Status: "FULL" } }),
    CabinetBay.count({ where: { Status: "OVERWEIGHT" } }),
    CabinetBay.count({ where: { Status: "MAINTENANCE" } }),
    StorageBox.count(),
    BoxRecord.count(),
    Request.count({ where: statusWhere("DRAFT") }),
    Request.count({ where: statusWhere("DEPARTMENT_APPROVED") }),
    Request.count({ where: statusWhere("FOR_CRH_APPROVAL") }),
    Request.count({ where: statusWhere("RECEIVED_FOR_STORAGE") }),
    Request.count({ where: statusWhere("STORAGE_ASSIGNED") }),
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
    storage: {
      cabinets: totalCabinets,
      cabinetBays: totalCabinetBays,
      availableBays,
      nearFullBays,
      fullBays,
      overweightBays,
      maintenanceBays,
      storageBoxes: totalStorageBoxes,
      storedRecords: totalBoxRecords,
    },
  };
};

module.exports = {
  getDashboardSummary,
};
