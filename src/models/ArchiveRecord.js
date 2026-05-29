const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ArchiveRecord = sequelize.define(
  'ArchiveRecord',
  {
    ArchiveRecordID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    DataListID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    ArchiveDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    RetentionPeriod: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    ArchiveStatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'ARCHIVED',
    },

    ReviewDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    DisposalDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    Reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    Remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    ArchivedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'tblArchiveRecords',
    timestamps: true,
  }
);

module.exports = ArchiveRecord;