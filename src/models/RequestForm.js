const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RequestForm = sequelize.define(
  "RequestForm",
  {
    RequestFormID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    RequestID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    RequestFormTypeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    FormData: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    Status: {
      type: DataTypes.ENUM("DRAFT", "GENERATED", "SUBMITTED", "REVIEWED", "APPROVED"),
      allowNull: false,
      defaultValue: "DRAFT",
    },

    PreparedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    ReviewedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    ApprovedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    Remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tblRequestForms",
    timestamps: true,
  }
);

module.exports = RequestForm;