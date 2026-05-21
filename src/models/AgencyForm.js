const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AgencyForm = sequelize.define('AgencyForm', {
  AgencyUniqueID: {
    type: DataTypes.STRING(100),
    primaryKey: true,
  },
  AgencyName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  AgencyAddress: {
    type: DataTypes.STRING(500),
  },
  AgencyContact: {
    type: DataTypes.STRING(100),
  },
  AgencyDate: {
    type: DataTypes.STRING(100),
  },
}, {
  tableName: 'tblAgencyForm',
  timestamps: false,
});

module.exports = AgencyForm;