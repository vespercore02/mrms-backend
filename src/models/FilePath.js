const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FilePath = sequelize.define('FilePath', {
  FilePathID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  FilePathLocation: {
    type: DataTypes.TEXT,
  },
  FilePathUniqueID: {
    type: DataTypes.STRING(100),
  },
}, {
  tableName: 'tblFilePath',
  timestamps: false,
});

module.exports = FilePath;