const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StorageBox = sequelize.define(
  "StorageBox",
  {
    StorageBoxID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    CabinetBayID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    BoxCode: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    BoxNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    DepartmentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    EstimatedWeightKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },

    Status: {
      type: DataTypes.ENUM("AVAILABLE", "OCCUPIED", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },

    Remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tblStorageBoxes",
    timestamps: true,
  },
);

module.exports = StorageBox;
