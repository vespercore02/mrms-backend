const { Cabinet, CabinetBay } = require("../models");

const formatNumber = (number, length = 2) => {
  return String(number).padStart(length, "0");
};

const getSideCode = (side) => {
  return side === "LEFT" ? "L" : "R";
};

const buildBayCode = ({ cabinetCode, side, levelNumber, bayNumber }) => {
  return `${cabinetCode}-${getSideCode(side)}-L${formatNumber(
    levelNumber
  )}-B${formatNumber(bayNumber)}`;
};

const getAllCabinetBays = async (query = {}) => {
  const where = {};

  if (query.cabinetId) {
    where.CabinetID = query.cabinetId;
  }

  if (query.status) {
    where.Status = query.status;
  }

  if (query.side) {
    where.Side = query.side;
  }

  return await CabinetBay.findAll({
    where,
    include: [Cabinet],
    order: [
      ["CabinetID", "ASC"],
      ["Side", "ASC"],
      ["LevelNumber", "DESC"],
      ["BayNumber", "ASC"],
    ],
  });
};

const getCabinetBayById = async (id) => {
  return await CabinetBay.findByPk(id, {
    include: [Cabinet],
  });
};

const createCabinetBay = async (payload) => {
  const cabinet = await Cabinet.findByPk(payload.CabinetID);

  if (!cabinet) {
    const error = new Error("Cabinet not found");
    error.statusCode = 404;
    throw error;
  }

  const side = payload.Side;
  const levelNumber = Number(payload.LevelNumber);
  const bayNumber = Number(payload.BayNumber);

  const bayCode =
    payload.BayCode ||
    buildBayCode({
      cabinetCode: cabinet.CabinetCode,
      side,
      levelNumber,
      bayNumber,
    });

  const existingBay = await CabinetBay.findOne({
    where: { BayCode: bayCode },
  });

  if (existingBay) {
    const error = new Error("Cabinet bay already exists");
    error.statusCode = 400;
    throw error;
  }

  return await CabinetBay.create({
    CabinetID: payload.CabinetID,
    Side: side,
    LevelNumber: levelNumber,
    BayNumber: bayNumber,
    BayCode: bayCode,
    MaxWeightKg: payload.MaxWeightKg || 50,
    CurrentWeightKg: payload.CurrentWeightKg || 0,
    MaxBoxes: payload.MaxBoxes || 3,
    CurrentBoxes: payload.CurrentBoxes || 0,
    Status: payload.Status || "AVAILABLE",
    Remarks: payload.Remarks || null,
  });
};

const updateCabinetBay = async (id, payload) => {
  const bay = await CabinetBay.findByPk(id);

  if (!bay) return null;

  await bay.update({
    MaxWeightKg: payload.MaxWeightKg ?? bay.MaxWeightKg,
    MaxBoxes: payload.MaxBoxes ?? bay.MaxBoxes,
    Status: payload.Status ?? bay.Status,
    Remarks: payload.Remarks ?? bay.Remarks,
  });

  return bay;
};

const updateCabinetBayStatus = async (id, status) => {
  const bay = await CabinetBay.findByPk(id);

  if (!bay) return null;

  await bay.update({ Status: status });

  return bay;
};

const deleteCabinetBay = async (id) => {
  const bay = await CabinetBay.findByPk(id);

  if (!bay) return null;

  await bay.destroy();

  return bay;
};

module.exports = {
  getAllCabinetBays,
  getCabinetBayById,
  createCabinetBay,
  updateCabinetBay,
  updateCabinetBayStatus,
  deleteCabinetBay,
};