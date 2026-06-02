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
    AgencyUniqueID: {
      type: DataTypes.STRING(100),
    },
    RequestedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Status: {
      type: DataTypes.ENUM(
        "SUBMITTED",
        "RECEIVED",
        "UNDER_REVIEW",
        "FOR_COMPLIANCE",
        "RESUBMITTED",
        "NOTICE_OF_INSPECTION",
        "INSPECTION_DONE",
        "APPROVED",
        "COMPLETED",
        "ARCHIVED",
        "REJECTED",
      ),
      defaultValue: "SUBMITTED",
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
