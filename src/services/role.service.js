const { Role, User } = require('../models');

const getAllRoles = async () => {
  return await Role.findAll({
    include: [User],
  });
};

const getRoleById = async (id) => {
  return await Role.findByPk(id, {
    include: [User],
  });
};

const createRole = async (payload) => {
  return await Role.create(payload);
};

const updateRole = async (id, payload) => {
  const role = await Role.findByPk(id);

  if (!role) return null;

  await role.update(payload);
  return role;
};

const deleteRole = async (id) => {
  const role = await Role.findByPk(id);

  if (!role) return null;

  await role.destroy();
  return role;
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};