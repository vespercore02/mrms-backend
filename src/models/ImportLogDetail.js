const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ImportLogDetail = sequelize.define(
  'ImportLogDetail',
  {
    ImportLogDetailID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ImportLogID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RowNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    AgencyUniqueID: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    DataListItemNo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    DataListSpecificName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    DataListPeriodCover: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    DataListRetentionPeriod: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'tblImportLogDetails',
    timestamps: true,
  }
);

module.exports = ImportLogDetail;