const express = require('express');
const authController = require('../controllers/auth.controller');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.post(
  '/login',
  validateRequest(['Email', 'Password']),
  authController.login
);

module.exports = router;