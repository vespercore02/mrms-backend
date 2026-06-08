const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RequestType = sequelize.define(
  "RequestType",
  {
    RequestTypeID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    RequestTypeCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    RequestTypeName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    Status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
  },
  {
    tableName: "tblRequestTypes",
    timestamps: true,
  }
);

module.exports = RequestType;