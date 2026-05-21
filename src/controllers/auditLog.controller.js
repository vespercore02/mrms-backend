const auditLogService = require('../services/auditLog.service');

const getAllAuditLogs = async (req, res) => {
  try {
    const logs = await auditLogService.getAllAuditLogs();

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message,
    });
  }
};

const getAuditLogById = async (req, res) => {
  try {
    const log = await auditLogService.getAuditLogById(req.params.id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Audit log not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: log,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch audit log',
      error: error.message,
    });
  }
};

module.exports = {
  getAllAuditLogs,
  getAuditLogById,
};