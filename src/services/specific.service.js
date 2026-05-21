const { Specific, Series } = require('../models');

const getAllSpecifics = async () => {
  return await Specific.findAll({
    include: [Series],
  });
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