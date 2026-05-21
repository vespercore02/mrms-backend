const roleService = require('../services/role.service');

const getAllRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();

    return res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch roles',
      error: error.message,
    });
  }
};

const getRoleById = async (req, res) => {
  try {
    const role = await roleService.getRoleById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch role',
      error: error.message,
    });
  }
};

const createRole = async (req, res) => {
  try {
    const role = await roleService.createRole(req.body);

    return res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create role',
      error: error.message,
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: role,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update role',
      error: error.message,
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    const role = await roleService.deleteRole(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete role',
      error: error.message,
    });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};