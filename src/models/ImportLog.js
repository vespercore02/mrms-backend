const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ImportLog = sequelize.define(
  'ImportLog',
  {
    ImportLogID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ModuleName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    FileName: {
      type: DataTypes.STRING(255),
    },
    TotalRows: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ImportedRows: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    SkippedRows: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ImportedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'tblImportLogs',
    timestamps: true,
  }
);

module.exports = ImportLog;