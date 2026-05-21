const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RequestStatusHistory = sequelize.define('RequestStatusHistory', {
  HistoryID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  RequestID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  OldStatus: {
    type: DataTypes.STRING(100),
  },
  NewStatus: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ChangedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Remarks: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'tblRequestStatusHistory',
  timestamps: true,
});

module.exports = RequestStatusHistory;