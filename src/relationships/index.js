const Department = require("../models/Department");
const Series = require("../models/Series");
const Specific = require("../models/Specific");
const AgencyForm = require("../models/AgencyForm");
const DataList = require("../models/DataList");
const FilePath = require("../models/FilePath");

const Role = require("../models/Role");
const User = require("../models/User");
const Request = require("../models/Request");
const RequestStatusHistory = require("../models/RequestStatusHistory");
const AuditLog = require("../models/AuditLog");
const ImportLog = require("../models/ImportLog");
const ImportLogDetail = require("../models/ImportLogDetail");
const ArchiveRecord = require("../models/ArchiveRecord");
const ArchiveStatusHistory = require("../models/ArchiveStatusHistory");

const Cabinet = require("../models/Cabinet");
const CabinetBay = require("../models/CabinetBay");
const StorageBox = require("../models/StorageBox");
const BoxRecord = require("../models/BoxRecord");

const RequestType = require("../models/RequestType");
const RequestFormType = require("../models/RequestFormType");
const RequestRequiredForm = require("../models/RequestRequiredForm");
const RequestForm = require("../models/RequestForm");

Department.hasMany(User, {
  foreignKey: "DepartmentID",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

User.belongsTo(Department, {
  foreignKey: "DepartmentID",
});

Department.hasMany(Series, { foreignKey: "DepartmentID" });
Series.belongsTo(Department, { foreignKey: "DepartmentID" });

Series.hasMany(Specific, { foreignKey: "SeriesID" });
Specific.belongsTo(Series, { foreignKey: "SeriesID" });

AgencyForm.hasMany(DataList, { foreignKey: "AgencyUniqueID" });
DataList.belongsTo(AgencyForm, { foreignKey: "AgencyUniqueID" });

AgencyForm.hasMany(FilePath, { foreignKey: "FilePathUniqueID" });
FilePath.belongsTo(AgencyForm, { foreignKey: "FilePathUniqueID" });

Role.hasMany(User, { foreignKey: "RoleID" });
User.belongsTo(Role, { foreignKey: "RoleID" });

User.hasMany(Request, { foreignKey: "RequestedBy" });
Request.belongsTo(User, { foreignKey: "RequestedBy", as: "requester" });

AgencyForm.hasMany(Request, { foreignKey: "AgencyUniqueID" });
Request.belongsTo(AgencyForm, { foreignKey: "AgencyUniqueID" });

Request.hasMany(RequestStatusHistory, { foreignKey: "RequestID" });
RequestStatusHistory.belongsTo(Request, { foreignKey: "RequestID" });

User.hasMany(RequestStatusHistory, {
  foreignKey: "ChangedBy",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

RequestStatusHistory.belongsTo(User, {
  foreignKey: "ChangedBy",
});

User.hasMany(RequestStatusHistory, { foreignKey: "ChangedBy" });
RequestStatusHistory.belongsTo(User, {
  foreignKey: "ChangedBy",
  as: "changedByUser",
});

User.hasMany(AuditLog, { foreignKey: "PerformedBy" });
AuditLog.belongsTo(User, { foreignKey: "PerformedBy" });

User.hasMany(ImportLog, { foreignKey: "ImportedBy" });
ImportLog.belongsTo(User, { foreignKey: "ImportedBy" });

ImportLog.hasMany(ImportLogDetail, { foreignKey: "ImportLogID" });
ImportLogDetail.belongsTo(ImportLog, { foreignKey: "ImportLogID" });

DataList.hasOne(ArchiveRecord, {
  foreignKey: "DataListID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ArchiveRecord.belongsTo(DataList, {
  foreignKey: "DataListID",
});

User.hasMany(ArchiveRecord, {
  foreignKey: "ArchivedBy",
});

ArchiveRecord.belongsTo(User, {
  foreignKey: "ArchivedBy",
});

ArchiveRecord.hasMany(ArchiveStatusHistory, {
  foreignKey: "ArchiveRecordID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ArchiveStatusHistory.belongsTo(ArchiveRecord, {
  foreignKey: "ArchiveRecordID",
});

User.hasMany(ArchiveStatusHistory, {
  foreignKey: "ChangedBy",
});

ArchiveStatusHistory.belongsTo(User, {
  foreignKey: "ChangedBy",
});

Cabinet.hasMany(CabinetBay, {
  foreignKey: "CabinetID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

CabinetBay.belongsTo(Cabinet, {
  foreignKey: "CabinetID",
});

CabinetBay.hasMany(StorageBox, {
  foreignKey: "CabinetBayID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Cabinet.hasMany(Request, {
  foreignKey: "CabinetID",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Request.belongsTo(Cabinet, {
  foreignKey: "CabinetID",
});

CabinetBay.hasMany(Request, {
  foreignKey: "CabinetBayID",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Request.belongsTo(CabinetBay, {
  foreignKey: "CabinetBayID",
});

StorageBox.hasMany(Request, {
  foreignKey: "StorageBoxID",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Request.belongsTo(StorageBox, {
  foreignKey: "StorageBoxID",
});

StorageBox.belongsTo(CabinetBay, {
  foreignKey: "CabinetBayID",
});

Department.hasMany(StorageBox, {
  foreignKey: "DepartmentID",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

StorageBox.belongsTo(Department, {
  foreignKey: "DepartmentID",
});

StorageBox.hasMany(BoxRecord, {
  foreignKey: "StorageBoxID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

BoxRecord.belongsTo(StorageBox, {
  foreignKey: "StorageBoxID",
});

DataList.hasMany(BoxRecord, {
  foreignKey: "DataListID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

BoxRecord.belongsTo(DataList, {
  foreignKey: "DataListID",
});

Request.hasMany(BoxRecord, {
  foreignKey: "RequestID",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

BoxRecord.belongsTo(Request, {
  foreignKey: "RequestID",
});

RequestType.hasMany(RequestRequiredForm, {
  foreignKey: "RequestTypeID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

RequestRequiredForm.belongsTo(RequestType, {
  foreignKey: "RequestTypeID",
});

RequestFormType.hasMany(RequestRequiredForm, {
  foreignKey: "RequestFormTypeID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

RequestRequiredForm.belongsTo(RequestFormType, {
  foreignKey: "RequestFormTypeID",
});

Request.hasMany(RequestForm, {
  foreignKey: "RequestID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

RequestType.hasMany(Request, {
  foreignKey: "RequestTypeID",
  as: "Requests",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Request.belongsTo(RequestType, {
  foreignKey: "RequestTypeID",
  as: "RequestTypeInfo",
});

RequestForm.belongsTo(Request, {
  foreignKey: "RequestID",
});

RequestFormType.hasMany(RequestForm, {
  foreignKey: "RequestFormTypeID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

RequestForm.belongsTo(RequestFormType, {
  foreignKey: "RequestFormTypeID",
});

User.hasMany(RequestForm, {
  foreignKey: "PreparedBy",
  as: "PreparedForms",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

RequestForm.belongsTo(User, {
  foreignKey: "PreparedBy",
  as: "PreparedUser",
});

User.hasMany(RequestForm, {
  foreignKey: "ReviewedBy",
  as: "ReviewedForms",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

RequestForm.belongsTo(User, {
  foreignKey: "ReviewedBy",
  as: "ReviewedUser",
});

User.hasMany(RequestForm, {
  foreignKey: "ApprovedBy",
  as: "ApprovedForms",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

RequestForm.belongsTo(User, {
  foreignKey: "ApprovedBy",
  as: "ApprovedUser",
});

Department.hasMany(Request, {
  foreignKey: "DepartmentID",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Request.belongsTo(Department, {
  foreignKey: "DepartmentID",
});
