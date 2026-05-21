const { FilePath, AgencyForm } = require('../models');

const getAllFilePaths = async () => {
  return await FilePath.findAll({
    include: [AgencyForm],
  });
};

const getFilePathById = async (id) => {
  return await FilePath.findByPk(id, {
    include: [AgencyForm],
  });
};

const createFilePath = async (payload) => {
  return await FilePath.create(payload);
};

const updateFilePath = async (id, payload) => {
  const filePath = await FilePath.findByPk(id);

  if (!filePath) {
    return null;
  }

  await filePath.update(payload);
  return filePath;
};

const deleteFilePath = async (id) => {
  const filePath = await FilePath.findByPk(id);

  if (!filePath) {
    return null;
  }

  await filePath.destroy();
  return filePath;
};

module.exports = {
  getAllFilePaths,
  getFilePathById,
  createFilePath,
  updateFilePath,
  deleteFilePath,
};