const importLogService = require('../services/importLog.service');

const getAllImportLogs = async (req, res) => {
  try {
    const logs = await importLogService.getAllImportLogs();

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch import logs',
      error: error.message,
    });
  }
};

module.exports = {
  getAllImportLogs,
};