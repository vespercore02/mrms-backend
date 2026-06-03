const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BoxRecord = sequelize.define(
  "BoxRecord",
  {
    BoxRecordID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    StorageBoxID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    DataListID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    RequestID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    Remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tblBoxRecords",
    timestamps: true,
  }
);

module.exports = BoxRecord;