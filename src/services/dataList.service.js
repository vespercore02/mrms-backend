const { DataList, AgencyForm } = require("../models");
const { Op } = require("sequelize");

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
  const existingRecords = await DataList.findAll();

  const existingKeys = new Set(
    existingRecords.map((item) => {
      const agencyId = item.AgencyUniqueID?.toString().trim().toLowerCase();
      const itemNo = item.DataListItemNo?.toString().trim().toLowerCase() || "";
      const specificName =
        item.DataListSpecificName?.toString().trim().toLowerCase() || "";
      const periodCover =
        item.DataListPeriodCover?.toString().trim().toLowerCase() || "";

      return `${agencyId}-${itemNo}-${specificName}-${periodCover}`;
    }),
  );

  const validRows = [];
  const duplicateRows = [];

  rows.forEach((row, index) => {
    const agencyId = row.AgencyUniqueID?.toString().trim();
    const itemNo = row.DataListItemNo?.toString().trim() || "";
    const specificName = row.DataListSpecificName?.toString().trim() || "";
    const periodCover = row.DataListPeriodCover?.toString().trim() || "";

    const key = `${agencyId?.toLowerCase()}-${itemNo.toLowerCase()}-${specificName.toLowerCase()}-${periodCover.toLowerCase()}`;

    if (existingKeys.has(key)) {
      duplicateRows.push({
        rowNumber: index + 1,
        ...row,
        reason: "Duplicate record already exists",
      });
    } else {
      existingKeys.add(key);
      validRows.push(row);
    }
  });

  const createdRecords =
    validRows.length > 0
      ? await DataList.bulkCreate(validRows, {
          validate: true,
        })
      : [];

  return {
    createdRecords,
    duplicateRows,
    importedRows: createdRecords.length,
    skippedRows: duplicateRows.length,
  };
};

module.exports = {
  getAllDataLists,
  getDataListById,
  createDataList,
  bulkCreateDataLists,
  updateDataList,
  deleteDataList,
};
