const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  AuditLogID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Action: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  TableName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  RecordID: {
    type: DataTypes.STRING(100),
  },
  OldValue: {
    type: DataTypes.JSON,
  },
  NewValue: {
    type: DataTypes.JSON,
  },
  PerformedBy: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'tblAuditLogs',
  timestamps: true,
});

module.exports = AuditLog;