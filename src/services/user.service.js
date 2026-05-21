const { User, Role } = require('../models');

const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['Password'] },
    include: [Role],
  });
};

const getUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: { exclude: ['Password'] },
    include: [Role],
  });
};

const createUser = async (payload) => {
  return await User.create(payload);
};

const updateUser = async (id, payload) => {
  const user = await User.findByPk(id);

  if (!user) return null;

  await user.update(payload);
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);

  if (!user) return null;

  await user.destroy();
  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};