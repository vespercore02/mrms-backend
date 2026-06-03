const { Cabinet, CabinetBay } = require("../models");

const getAllCabinets = async (query = {}) => {
  const where = {};

  if (query.zone) {
    where.Zone = query.zone;
  }

  if (query.status) {
    where.Status = query.status;
  }

  return await Cabinet.findAll({
    where,
    include: [
      {
        model: CabinetBay,
      },
    ],
    order: [
      ["Zone", "ASC"],
      ["FloorRow", "ASC"],
      ["FloorColumn", "ASC"],
    ],
  });
};

const getCabinetById = async (id) => {
  return await Cabinet.findByPk(id, {
    include: [
      {
        model: CabinetBay,
        order: [
          ["Side", "ASC"],
          ["LevelNumber", "DESC"],
          ["BayNumber", "ASC"],
        ],
      },
    ],
  });
};

const getCabinetByCode = async (cabinetCode) => {
  return await Cabinet.findOne({
    where: { CabinetCode: cabinetCode },
    include: [
      {
        model: CabinetBay,
      },
    ],
  });
};

const createCabinet = async (payload) => {
  return await Cabinet.create(payload);
};

const updateCabinet = async (id, payload) => {
  const cabinet = await Cabinet.findByPk(id);

  if (!cabinet) return null;

  await cabinet.update(payload);

  return cabinet;
};

const deleteCabinet = async (id) => {
  const cabinet = await Cabinet.findByPk(id);

  if (!cabinet) return null;

  await cabinet.destroy();

  return cabinet;
};

module.exports = {
  getAllCabinets,
  getCabinetById,
  getCabinetByCode,
  createCabinet,
  updateCabinet,
  deleteCabinet,
};