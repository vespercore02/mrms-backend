const { StorageBox, CabinetBay, Cabinet, Department } = require("../models");

const formatNumber = (number, length = 2) => {
  return String(number).padStart(length, "0");
};

const buildBoxCode = (bayCode, boxNumber) => {
  return `${bayCode}-BX${formatNumber(boxNumber)}`;
};

const calculateBayStatus = ({
  currentWeight,
  maxWeight,
  currentBoxes,
  maxBoxes,
}) => {
  if (currentWeight > maxWeight) return "OVERWEIGHT";
  if (currentBoxes >= maxBoxes) return "FULL";

  const weightPercent = maxWeight > 0 ? (currentWeight / maxWeight) * 100 : 0;
  const boxPercent = maxBoxes > 0 ? (currentBoxes / maxBoxes) * 100 : 0;

  if (weightPercent >= 80 || boxPercent >= 80) return "NEAR_FULL";

  return "AVAILABLE";
};

const recomputeBayCapacity = async (cabinetBayId) => {
  const bay = await CabinetBay.findByPk(cabinetBayId);

  if (!bay) return null;

  const boxes = await StorageBox.findAll({
    where: { CabinetBayID: cabinetBayId },
  });

  const currentBoxes = boxes.length;

  const currentWeight = boxes.reduce((total, box) => {
    return total + Number(box.EstimatedWeightKg || 0);
  }, 0);

  const status = calculateBayStatus({
    currentWeight,
    maxWeight: Number(bay.MaxWeightKg),
    currentBoxes,
    maxBoxes: Number(bay.MaxBoxes),
  });

  await bay.update({
    CurrentBoxes: currentBoxes,
    CurrentWeightKg: currentWeight,
    Status: status,
  });

  return bay;
};

const getNextAvailableBoxNumber = (boxes, maxBoxes) => {
  const usedNumbers = boxes.map((box) => Number(box.BoxNumber));

  for (let i = 1; i <= maxBoxes; i++) {
    if (!usedNumbers.includes(i)) {
      return i;
    }
  }

  return null;
};

const getAllStorageBoxes = async (query = {}) => {
  const where = {};

  if (query.cabinetBayId) {
    where.CabinetBayID = query.cabinetBayId;
  }

  if (query.departmentId) {
    where.DepartmentID = query.departmentId;
  }

  if (query.status) {
    where.Status = query.status;
  }

  return await StorageBox.findAll({
    where,
    include: [
      Department,
      {
        model: CabinetBay,
        include: [Cabinet],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const getStorageBoxById = async (id) => {
  return await StorageBox.findByPk(id, {
    include: [
      Department,
      {
        model: CabinetBay,
        include: [Cabinet],
      },
    ],
  });
};

const createStorageBox = async (payload) => {
  const bay = await CabinetBay.findByPk(payload.CabinetBayID);

  if (!bay) {
    const error = new Error("Cabinet bay not found");
    error.statusCode = 404;
    throw error;
  }

  if (bay.Status === "MAINTENANCE") {
    const error = new Error("Cannot add box to a bay under maintenance");
    error.statusCode = 400;
    throw error;
  }

  const existingBoxes = await StorageBox.findAll({
    where: { CabinetBayID: payload.CabinetBayID },
  });

  const currentBoxes = existingBoxes.length;
  const currentWeight = existingBoxes.reduce((total, box) => {
    return total + Number(box.EstimatedWeightKg || 0);
  }, 0);

  const newWeight = Number(payload.EstimatedWeightKg || 0);
  const maxWeight = Number(bay.MaxWeightKg);
  const maxBoxes = Number(bay.MaxBoxes);

  if (currentBoxes + 1 > maxBoxes) {
    const error = new Error(
      `Bay box capacity exceeded. Max boxes: ${maxBoxes}`,
    );
    error.statusCode = 400;
    throw error;
  }

  if (currentWeight + newWeight > maxWeight) {
    const error = new Error(
      `Bay weight limit exceeded. Current: ${currentWeight}kg, New: ${newWeight}kg, Max: ${maxWeight}kg`,
    );
    error.statusCode = 400;
    throw error;
  }

  const boxNumber =
    payload.BoxNumber || getNextAvailableBoxNumber(existingBoxes, maxBoxes);

  if (!boxNumber) {
    const error = new Error(
      `No available box slot in this bay. Max boxes: ${maxBoxes}`,
    );
    error.statusCode = 400;
    throw error;
  }

  const boxCode = payload.BoxCode || buildBoxCode(bay.BayCode, boxNumber);

  const existingBoxCode = await StorageBox.findOne({
    where: { BoxCode: boxCode },
  });

  if (existingBoxCode) {
    const error = new Error("Box code already exists");
    error.statusCode = 400;
    throw error;
  }

  const box = await StorageBox.create({
    CabinetBayID: payload.CabinetBayID,
    BoxCode: boxCode,
    BoxNumber: boxNumber,
    DepartmentID: payload.DepartmentID || null,
    EstimatedWeightKg: newWeight,
    Status: payload.Status || "ACTIVE",
    Remarks: payload.Remarks || null,
  });

  await recomputeBayCapacity(payload.CabinetBayID);

  return await getStorageBoxById(box.StorageBoxID);
};

const updateStorageBox = async (id, payload) => {
  const box = await StorageBox.findByPk(id);

  if (!box) return null;

  const bay = await CabinetBay.findByPk(box.CabinetBayID);

  if (!bay) {
    const error = new Error("Cabinet bay not found");
    error.statusCode = 404;
    throw error;
  }

  const boxes = await StorageBox.findAll({
    where: { CabinetBayID: box.CabinetBayID },
  });

  const otherBoxesWeight = boxes.reduce((total, item) => {
    if (item.StorageBoxID === box.StorageBoxID) return total;
    return total + Number(item.EstimatedWeightKg || 0);
  }, 0);

  const newWeight =
    payload.EstimatedWeightKg !== undefined
      ? Number(payload.EstimatedWeightKg)
      : Number(box.EstimatedWeightKg);

  if (otherBoxesWeight + newWeight > Number(bay.MaxWeightKg)) {
    const error = new Error(
      `Bay weight limit exceeded. Other boxes: ${otherBoxesWeight}kg, New: ${newWeight}kg, Max: ${bay.MaxWeightKg}kg`,
    );
    error.statusCode = 400;
    throw error;
  }

  await box.update({
    DepartmentID: payload.DepartmentID ?? box.DepartmentID,
    EstimatedWeightKg: newWeight,
    Status: payload.Status ?? box.Status,
    Remarks: payload.Remarks ?? box.Remarks,
  });

  await recomputeBayCapacity(box.CabinetBayID);

  return await getStorageBoxById(id);
};

const deleteStorageBox = async (id) => {
  const box = await StorageBox.findByPk(id);

  if (!box) return null;

  const cabinetBayId = box.CabinetBayID;

  await box.destroy();

  await recomputeBayCapacity(cabinetBayId);

  return box;
};

module.exports = {
  getAllStorageBoxes,
  getStorageBoxById,
  createStorageBox,
  updateStorageBox,
  deleteStorageBox,
  recomputeBayCapacity,
};
