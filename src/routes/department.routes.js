const express = require('express');
const departmentController = require('../controllers/department.controller');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);

router.post(
  '/',
  validateRequest(['DepartmentName']),
  departmentController.createDepartment
);

router.put(
  '/:id',
  validateRequest(['DepartmentName']),
  departmentController.updateDepartment
);

router.delete('/:id', departmentController.deleteDepartment);

module.exports = router;