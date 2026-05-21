const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Specific = sequelize.define('Specific', {
  SpecificID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  SpecificName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  RetentionPeriod: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  SeriesID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'tblSpecific',
  timestamps: false,
});

module.exports = Specific;