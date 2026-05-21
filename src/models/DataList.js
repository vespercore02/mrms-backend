const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DataList = sequelize.define('DataList', {
  DataListID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  AgencyUniqueID: {
    type: DataTypes.STRING(100),
  },
  DataListItemNo: {
    type: DataTypes.STRING(100),
  },
  DataListSpecificName: {
    type: DataTypes.STRING(255),
  },
  DataListPeriodCover: {
    type: DataTypes.STRING(255),
  },
  DataListRetentionPeriod: {
    type: DataTypes.STRING(100),
  },
}, {
  tableName: 'tblDataList',
  timestamps: false,
});

module.exports = DataList;