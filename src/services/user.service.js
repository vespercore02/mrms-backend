const bcrypt = require("bcryptjs");
const { User, Role, Department } = require("../models");

const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ["Password"] },
    include: [Role, Department],
  });
};

const getUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: { exclude: ["Password"] },
    include: [Role, Department],
  });
};

const createUser = async (payload) => {
  const hashedPassword = await bcrypt.hash(payload.Password, 10);

  return await User.create({
    FullName: payload.FullName,
    Email: payload.Email,
    Password: hashedPassword,
    RoleID: payload.RoleID,
    DepartmentID: payload.DepartmentID || null,
    Status: payload.Status || "active",
  });
};

const updateUser = async (id, payload) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  const updatePayload = {
    FullName: payload.FullName ?? user.FullName,
    Email: payload.Email ?? user.Email,
    RoleID: payload.RoleID ?? user.RoleID,
    DepartmentID: payload.DepartmentID ?? user.DepartmentID,
    Status: payload.Status ?? user.Status,
  };

  if (payload.Password) {
    updatePayload.Password = await bcrypt.hash(payload.Password, 10);
  }

  await user.update(updatePayload);
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
