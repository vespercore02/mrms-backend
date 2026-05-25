const { Series, Department } = require('../models');
const { Op } = require('sequelize');
const { getPagination, getPagingData } = require('../utils/pagination');

const getAllSeries = async (query) => {
  const { page, limit, offset } = getPagination(query);

  const where = {};

  if (query.departmentId) {
    where.DepartmentID = query.departmentId;
  }

  if (query.search) {
    where[Op.or] = [
      { ItemNoID: { [Op.like]: `%${query.search}%` } },
      { SeriesName: { [Op.like]: `%${query.search}%` } },
    ];
  }

  const result = await Series.findAndCountAll({
    where,
    include: [Department],
    limit,
    offset,
    order: [['ItemNoID', 'ASC']],
    distinct: true,
  });

  return getPagingData(result, page, limit);
};

const getSeriesById = async (id) => {
  return await Series.findByPk(id, {
    include: [Department],
  });
};

const createSeries = async (payload) => {
  return await Series.create(payload);
};

const updateSeries = async (id, payload) => {
  const series = await Series.findByPk(id);

  if (!series) {
    return null;
  }

  await series.update(payload);
  return series;
};

const deleteSeries = async (id) => {
  const series = await Series.findByPk(id);

  if (!series) {
    return null;
  }

  await series.destroy();
  return series;
};

module.exports = {
  getAllSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
};