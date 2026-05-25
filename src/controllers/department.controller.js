const departmentService = require('../services/department.service');

const getAllDepartments = async (req, res) => {
  try {
    const departments = await departmentService.getAllDepartments(req.query);

    return res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch departments',
      error: error.message,
    });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch department',
      error: error.message,
    });
  }
};

const createDepartment = async (req, res) => {
  try {
    const department = await departmentService.createDepartment(req.body);

    return res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create department',
      error: error.message,
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const department = await departmentService.updateDepartment(req.params.id, req.body);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update department',
      error: error.message,
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await departmentService.deleteDepartment(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete department',
      error: error.message,
    });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};