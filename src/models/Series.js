const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Series = sequelize.define('Series', {
  SeriesID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ItemNoID: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  SeriesName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  DepartmentID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'tblSeries',
  timestamps: false,
});

module.exports = Series;