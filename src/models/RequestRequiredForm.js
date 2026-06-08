const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RequestRequiredForm = sequelize.define(
  "RequestRequiredForm",
  {
    RequestRequiredFormID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    RequestTypeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    RequestFormTypeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    RequirementType: {
      type: DataTypes.ENUM("REQUIRED", "CONDITIONAL", "OPTIONAL"),
      allowNull: false,
      defaultValue: "REQUIRED",
    },

    TriggerCondition: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    SortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    Status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
  },
  {
    tableName: "tblRequestRequiredForms",
    timestamps: true,
  }
);

module.exports = RequestRequiredForm;