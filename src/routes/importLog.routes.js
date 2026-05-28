const express = require('express');
const importLogController = require('../controllers/importLog.controller');

const router = express.Router();

router.get('/', importLogController.getAllImportLogs);

module.exports = router;