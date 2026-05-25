const { Department } = require('../models');
const { Op } = require('sequelize');
const { getPagination, getPagingData } = require('../utils/pagination');

const getAllDepartments = async (query) => {
  const { page, limit, offset } = getPagination(query);

  const where = {};

  if (query.search) {
    where.DepartmentName = {
      [Op.like]: `%${query.search}%`,
    };
  }

  const result = await Department.findAndCountAll({
    where,
    limit,
    offset,
    order: [['DepartmentName', 'ASC']],
  });

  return getPagingData(result, page, limit);
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