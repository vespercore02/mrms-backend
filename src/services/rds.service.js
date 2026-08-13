const { Op } = require("sequelize");
const {
  Series,
  Specific,
  RecordsSchedule,
  Department,
} = require("../models");

const { getPagination, getPagingData } = require("../utils/pagination");

const getAllRdsEntries = async (query = {}) => {
  const { page, limit, offset } = getPagination({
    ...query,
    limit: query.limit || 20,
  });

  const where = {};
  const scheduleWhere = {};

  // Department filter
  if (query.departmentId) {
    where.DepartmentID = query.departmentId;
  }

  // Category filter
  if (query.category) {
    where.Category = query.category;
  }

  // RDS year filter
  if (query.year) {
    where.RdsYear = query.year;
  }

  // Records Schedule filters
  if (query.scheduleType) {
    scheduleWhere.ScheduleType = query.scheduleType;
  }

  if (query.status) {
    scheduleWhere.Status = query.status;
  } else {
    scheduleWhere.Status = "ACTIVE";
  }

  // Search by Item No., Series title, or Specific description
  if (query.search) {
    const search = String(query.search).trim();

    if (search) {
      where[Op.or] = [
        {
          ItemNoID: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          SeriesName: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          "$Specifics.SpecificName$": {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }
  }

  const result = await Series.findAndCountAll({
    where,
    include: [
      {
        model: Department,
        required: false,
      },
      {
        model: RecordsSchedule,
        where: scheduleWhere,
        required: true,
      },
      {
        model: Specific,
        required: false,
      },
    ],
    limit,
    offset,
    order: [
      ["Category", "ASC"],
      ["ItemNoID", "ASC"],
    ],
    distinct: true,
    subQuery: false,
  });

  return getPagingData(result, page, limit);
};

const getRdsEntryById = async (id) => {
  return await Series.findByPk(id, {
    include: [
      {
        model: Department,
        required: false,
      },
      {
        model: RecordsSchedule,
        required: false,
      },
      {
        model: Specific,
        required: false,
      },
    ],
  });
};

const getRdsFilters = async () => {
  const categoriesRaw = await Series.findAll({
    attributes: ["Category"],
    where: {
      Category: {
        [Op.ne]: null,
      },
    },
    group: ["Category"],
    order: [["Category", "ASC"]],
    raw: true,
  });

  const yearsRaw = await Series.findAll({
    attributes: ["RdsYear"],
    where: {
      RdsYear: {
        [Op.ne]: null,
      },
    },
    group: ["RdsYear"],
    order: [["RdsYear", "DESC"]],
    raw: true,
  });

  const scheduleTypesRaw = await RecordsSchedule.findAll({
    attributes: ["ScheduleType"],
    where: {
      Status: "ACTIVE",
    },
    group: ["ScheduleType"],
    order: [["ScheduleType", "ASC"]],
    raw: true,
  });

  return {
    scheduleTypes: scheduleTypesRaw
      .map((item) => item.ScheduleType)
      .filter(Boolean),

    categories: categoriesRaw
      .map((item) => item.Category)
      .filter(Boolean),

    years: yearsRaw
      .map((item) => item.RdsYear)
      .filter(Boolean),
  };
};

module.exports = {
  getAllRdsEntries,
  getRdsEntryById,
  getRdsFilters,
};