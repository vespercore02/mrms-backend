const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RequestFormType = sequelize.define(
  "RequestFormType",
  {
    RequestFormTypeID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    FormCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    FormName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    FormCategory: {
      type: DataTypes.ENUM("LGU", "NAP", "INTERNAL"),
      allowNull: false,
      defaultValue: "INTERNAL",
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
    tableName: "tblRequestFormTypes",
    timestamps: true,
  }
);

module.exports = RequestFormType;