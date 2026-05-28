const { ImportLog, User } = require('../models');

const getAllImportLogs = async () => {
  return await ImportLog.findAll({
    include: [
      {
        model: User,
        attributes: { exclude: ['Password'] },
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};

module.exports = {
  getAllImportLogs,
};