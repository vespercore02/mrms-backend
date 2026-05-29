const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ArchiveStatusHistory = sequelize.define(
  "ArchiveStatusHistory",
  {
    ArchiveStatusHistoryID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ArchiveRecordID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    OldStatus: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    NewStatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ChangedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "tblArchiveStatusHistory",
    timestamps: true,
  }
);

module.exports = ArchiveStatusHistory;