const Department = require('../models/Department');
const Series = require('../models/Series');
const Specific = require('../models/Specific');
const AgencyForm = require('../models/AgencyForm');
const DataList = require('../models/DataList');
const FilePath = require('../models/FilePath');

const Role = require('../models/Role');
const User = require('../models/User');
const Request = require('../models/Request');
const RequestStatusHistory = require('../models/RequestStatusHistory');
const AuditLog = require('../models/AuditLog');
const ImportLog = require('../models/ImportLog');
const ImportLogDetail = require('../models/ImportLogDetail');
const ArchiveRecord = require('../models/ArchiveRecord');
const ArchiveStatusHistory = require("../models/ArchiveStatusHistory");


Department.hasMany(Series, { foreignKey: 'DepartmentID' });
Series.belongsTo(Department, { foreignKey: 'DepartmentID' });

Series.hasMany(Specific, { foreignKey: 'SeriesID' });
Specific.belongsTo(Series, { foreignKey: 'SeriesID' });

AgencyForm.hasMany(DataList, { foreignKey: 'AgencyUniqueID' });
DataList.belongsTo(AgencyForm, { foreignKey: 'AgencyUniqueID' });

AgencyForm.hasMany(FilePath, { foreignKey: 'FilePathUniqueID' });
FilePath.belongsTo(AgencyForm, { foreignKey: 'FilePathUniqueID' });

Role.hasMany(User, { foreignKey: 'RoleID' });
User.belongsTo(Role, { foreignKey: 'RoleID' });

User.hasMany(Request, { foreignKey: 'RequestedBy' });
Request.belongsTo(User, { foreignKey: 'RequestedBy', as: 'requester' });

AgencyForm.hasMany(Request, { foreignKey: 'AgencyUniqueID' });
Request.belongsTo(AgencyForm, { foreignKey: 'AgencyUniqueID' });

Request.hasMany(RequestStatusHistory, { foreignKey: 'RequestID' });
RequestStatusHistory.belongsTo(Request, { foreignKey: 'RequestID' });

User.hasMany(RequestStatusHistory, { foreignKey: 'ChangedBy' });
RequestStatusHistory.belongsTo(User, { foreignKey: 'ChangedBy', as: 'changedByUser' });

User.hasMany(AuditLog, { foreignKey: 'PerformedBy' });
AuditLog.belongsTo(User, { foreignKey: 'PerformedBy' });

User.hasMany(ImportLog, { foreignKey: 'ImportedBy' });
ImportLog.belongsTo(User, { foreignKey: 'ImportedBy' });

ImportLog.hasMany(ImportLogDetail, { foreignKey: 'ImportLogID' });
ImportLogDetail.belongsTo(ImportLog, { foreignKey: 'ImportLogID' });

DataList.hasOne(ArchiveRecord, {
  foreignKey: 'DataListID',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

ArchiveRecord.belongsTo(DataList, {
  foreignKey: 'DataListID',
});

User.hasMany(ArchiveRecord, {
  foreignKey: 'ArchivedBy',
});

ArchiveRecord.belongsTo(User, {
  foreignKey: 'ArchivedBy',
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