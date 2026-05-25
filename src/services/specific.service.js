const { Specific, Series } = require('../models');
const { Op } = require('sequelize');
const { getPagination, getPagingData } = require('../utils/pagination');

const getAllSpecifics = async (query) => {
  const { page, limit, offset } = getPagination(query);

  const where = {};

  if (query.seriesId) {
    where.SeriesID = query.seriesId;
  }

  if (query.search) {
    where[Op.or] = [
      { SpecificName: { [Op.like]: `%${query.search}%` } },
      { RetentionPeriod: { [Op.like]: `%${query.search}%` } },
    ];
  }

  const result = await Specific.findAndCountAll({
    where,
    include: [Series],
    limit,
    offset,
    order: [['SpecificName', 'ASC']],
    distinct: true,
  });

  return getPagingData(result, page, limit);
};

const getSpecificById = async (id) => {
  return await Specific.findByPk(id, {
    include: [Series],
  });
};

const createSpecific = async (payload) => {
  return await Specific.create(payload);
};

const updateSpecific = async (id, payload) => {
  const specific = await Specific.findByPk(id);

  if (!specific) {
    return null;
  }

  await specific.update(payload);
  return specific;
};

const deleteSpecific = async (id) => {
  const specific = await Specific.findByPk(id);

  if (!specific) {
    return null;
  }

  await specific.destroy();
  return specific;
};

module.exports = {
  getAllSpecifics,
  getSpecificById,
  createSpecific,
  updateSpecific,
  deleteSpecific,
};