const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cabinet = sequelize.define(
  "Cabinet",
  {
    CabinetID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CabinetCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    Zone: {
      type: DataTypes.ENUM("A", "B"),
      allowNull: false,
    },
    FloorRow: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    FloorColumn: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    TotalLevels: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 6,
    },
    TotalBays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    Status: {
      type: DataTypes.ENUM("ACTIVE", "MAINTENANCE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
    Remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tblCabinets",
    timestamps: true,
  }
);

module.exports = Cabinet;