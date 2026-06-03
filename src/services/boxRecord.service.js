const {
  BoxRecord,
  StorageBox,
  CabinetBay,
  Cabinet,
  DataList,
  AgencyForm,
  Request,
} = require("../models");

const getAllBoxRecords = async (query = {}) => {
  const where = {};

  if (query.storageBoxId) {
    where.StorageBoxID = query.storageBoxId;
  }

  if (query.dataListId) {
    where.DataListID = query.dataListId;
  }

  if (query.requestId) {
    where.RequestID = query.requestId;
  }

  return await BoxRecord.findAll({
    where,
    include: [
      {
        model: StorageBox,
        include: [
          {
            model: CabinetBay,
            include: [Cabinet],
          },
        ],
      },
      {
        model: DataList,
        include: [AgencyForm],
      },
      Request,
    ],
    order: [["createdAt", "DESC"]],
  });
};

const getBoxRecordById = async (id) => {
  return await BoxRecord.findByPk(id, {
    include: [
      {
        model: StorageBox,
        include: [
          {
            model: CabinetBay,
            include: [Cabinet],
          },
        ],
      },
      {
        model: DataList,
        include: [AgencyForm],
      },
      Request,
    ],
  });
};

const assignDataListToBox = async (payload) => {
  const box = await StorageBox.findByPk(payload.StorageBoxID);

  if (!box) {
    const error = new Error("Storage box not found");
    error.statusCode = 404;
    throw error;
  }

  const dataList = await DataList.findByPk(payload.DataListID);

  if (!dataList) {
    const error = new Error("Data list record not found");
    error.statusCode = 404;
    throw error;
  }

  const existingAssignment = await BoxRecord.findOne({
    where: {
      StorageBoxID: payload.StorageBoxID,
      DataListID: payload.DataListID,
    },
  });

  if (existingAssignment) {
    const error = new Error("This data list record is already assigned to this box");
    error.statusCode = 400;
    throw error;
  }

  const record = await BoxRecord.create({
    StorageBoxID: payload.StorageBoxID,
    DataListID: payload.DataListID,
    RequestID: payload.RequestID || null,
    Remarks: payload.Remarks || null,
  });

  return await getBoxRecordById(record.BoxRecordID);
};

const updateBoxRecord = async (id, payload) => {
  const record = await BoxRecord.findByPk(id);

  if (!record) return null;

  await record.update({
    RequestID: payload.RequestID ?? record.RequestID,
    Remarks: payload.Remarks ?? record.Remarks,
  });

  return await getBoxRecordById(id);
};

const deleteBoxRecord = async (id) => {
  const record = await BoxRecord.findByPk(id);

  if (!record) return null;

  await record.destroy();

  return record;
};

module.exports = {
  getAllBoxRecords,
  getBoxRecordById,
  assignDataListToBox,
  updateBoxRecord,
  deleteBoxRecord,
};