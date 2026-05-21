const express = require('express');
const auditLogController = require('../controllers/auditLog.controller');

const router = express.Router();

router.get('/', auditLogController.getAllAuditLogs);
router.get('/:id', auditLogController.getAuditLogById);

module.exports = router;