const { ImportLog, ImportLogDetail, User } = require('../models');

const getAllImportLogs = async () => {
  return await ImportLog.findAll({
    include: [
      {
        model: User,
        attributes: { exclude: ['Password'] },
      },
      {
        model: ImportLogDetail,
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};

module.exports = {
  getAllImportLogs,
};