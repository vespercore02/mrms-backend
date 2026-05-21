const { Series, Department } = require('../models');

const getAllSeries = async () => {
  return await Series.findAll({
    include: [Department],
  });
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