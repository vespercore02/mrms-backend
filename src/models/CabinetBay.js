const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CabinetBay = sequelize.define(
  "CabinetBay",
  {
    CabinetBayID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CabinetID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Side: {
      type: DataTypes.ENUM("LEFT", "RIGHT"),
      allowNull: false,
    },
    LevelNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BayNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BayCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    MaxWeightKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 50.0,
    },
    CurrentWeightKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    MaxBoxes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
    },
    CurrentBoxes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Status: {
      type: DataTypes.ENUM(
        "AVAILABLE",
        "NEAR_FULL",
        "FULL",
        "OVERWEIGHT",
        "MAINTENANCE"
      ),
      allowNull: false,
      defaultValue: "AVAILABLE",
    },
    Remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tblCabinetBays",
    timestamps: true,
  }
);

module.exports = CabinetBay;