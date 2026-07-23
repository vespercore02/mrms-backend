const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RecordsSchedule = sequelize.define(
  "RecordsSchedule",
  {
    RecordsScheduleID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    ScheduleCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    ScheduleName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    ScheduleType: {
      type: DataTypes.ENUM("GRDS", "RDS"),
      allowNull: false,
      defaultValue: "GRDS",
    },

    SeriesYear: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    Category: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    DepartmentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    Status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE", "SUPERSEDED"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
  },
  {
    tableName: "tblRecordsSchedules",
    timestamps: true,
  },
);

module.exports = RecordsSchedule;