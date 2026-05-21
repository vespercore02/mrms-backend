const { Department } = require('../models');

const getAllDepartments = async () => {
  return await Department.findAll();
};

const getDepartmentById = async (id) => {
  return await Department.findByPk(id);
};

const createDepartment = async (payload) => {
  return await Department.create(payload);
};

const updateDepartment = async (id, payload) => {
  const department = await Department.findByPk(id);

  if (!department) {
    return null;
  }

  await department.update(payload);
  return department;
};

const deleteDepartment = async (id) => {
  const department = await Department.findByPk(id);

  if (!department) {
    return null;
  }

  await department.destroy();
  return department;
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};