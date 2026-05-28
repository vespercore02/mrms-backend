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