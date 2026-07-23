const { Op } = require("sequelize");
const { RecordsSchedule, Department, Series, Specific } = require("../models");

const getAllRecordsSchedules = async (query = {}) => {
  const where = {};

  if (query.status) {
    where.Status = query.status;
  }

  if (query.scheduleType) {
    where.ScheduleType = query.scheduleType;
  }

  if (query.departmentId) {
    where.DepartmentID = query.departmentId;
  }

  if (query.search) {
    where[Op.or] = [
      {
        ScheduleCode: {
          [Op.like]: `%${query.search}%`,
        },
      },
      {
        ScheduleName: {
          [Op.like]: `%${query.search}%`,
        },
      },
      {
        Category: {
          [Op.like]: `%${query.search}%`,
        },
      },
    ];
  }

  return RecordsSchedule.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });
};

const getRecordsScheduleById = async (recordsScheduleId) => {
  const recordsSchedule = await RecordsSchedule.findByPk(recordsScheduleId, {
    include: [
      {
        model: Series,
        include: [
          {
            model: Specific,
          },
        ],
      },
    ],
  });

  if (!recordsSchedule) {
    const error = new Error("Records schedule not found");
    error.statusCode = 404;

    throw error;
  }

  return recordsSchedule;
};

const createRecordsSchedule = async (data) => {
  return RecordsSchedule.create({
    ScheduleCode: data.ScheduleCode,
    ScheduleName: data.ScheduleName,
    ScheduleType: data.ScheduleType,
    SeriesYear: data.SeriesYear || null,
    Category: data.Category || null,
    DepartmentID: data.DepartmentID || null,
    Status: data.Status || "ACTIVE",
  });
};

const updateRecordsSchedule = async (recordsScheduleId, data) => {
  const recordsSchedule = await RecordsSchedule.findByPk(recordsScheduleId);

  if (!recordsSchedule) {
    const error = new Error("Records schedule not found");
    error.statusCode = 404;

    throw error;
  }

  await recordsSchedule.update({
    ScheduleCode: data.ScheduleCode ?? recordsSchedule.ScheduleCode,
    ScheduleName: data.ScheduleName ?? recordsSchedule.ScheduleName,
    ScheduleType: data.ScheduleType ?? recordsSchedule.ScheduleType,
    SeriesYear: data.SeriesYear ?? recordsSchedule.SeriesYear,
    Category: data.Category ?? recordsSchedule.Category,
    DepartmentID: data.DepartmentID ?? recordsSchedule.DepartmentID,
    Status: data.Status ?? recordsSchedule.Status,
  });

  return recordsSchedule;
};

const deactivateRecordsSchedule = async (recordsScheduleId) => {
  const recordsSchedule = await RecordsSchedule.findByPk(recordsScheduleId);

  if (!recordsSchedule) {
    const error = new Error("Records schedule not found");
    error.statusCode = 404;

    throw error;
  }

  await recordsSchedule.update({
    Status: "INACTIVE",
  });

  return recordsSchedule;
};

module.exports = {
  getAllRecordsSchedules,
  getRecordsScheduleById,
  createRecordsSchedule,
  updateRecordsSchedule,
  deactivateRecordsSchedule,
};
