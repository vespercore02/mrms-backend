const { DataList, AgencyForm } = require('../models');

const getAllDataLists = async () => {
  return await DataList.findAll({
    include: [AgencyForm],
  });
};

const getDataListById = async (id) => {
  return await DataList.findByPk(id, {
    include: [AgencyForm],
  });
};

const createDataList = async (payload) => {
  return await DataList.create(payload);
};

const updateDataList = async (id, payload) => {
  const dataList = await DataList.findByPk(id);

  if (!dataList) {
    return null;
  }

  await dataList.update(payload);
  return dataList;
};

const deleteDataList = async (id) => {
  const dataList = await DataList.findByPk(id);

  if (!dataList) {
    return null;
  }

  await dataList.destroy();
  return dataList;
};

const bulkCreateDataLists = async (rows) => {
  const createdRecords = await DataList.bulkCreate(rows, {
    validate: true,
  });

  return createdRecords;
};

module.exports = {
  getAllDataLists,
  getDataListById,
  createDataList,
  bulkCreateDataLists,
  updateDataList,
  deleteDataList,
};