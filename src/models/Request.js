const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Request = sequelize.define(
  "Request",
  {
    RequestID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    RequestCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    RequestType: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    RequestTypeID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    DepartmentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    AgencyUniqueID: {
      type: DataTypes.STRING(100),
    },
    RequestedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Status: {
      type: DataTypes.ENUM(
        "DRAFT",
        "SUBMITTED",
        "RECEIVED",
        "UNDER_REVIEW",
        "FOR_COMPLIANCE",
        "RESUBMITTED",
        "APPROVED",
        "REJECTED",
        "COMPLETED",
        "ARCHIVED",
      ),
      allowNull: false,
      defaultValue: "DRAFT",
    },
    Remarks: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "tblRequests",
    timestamps: true,
  },
);

module.exports = Request;
