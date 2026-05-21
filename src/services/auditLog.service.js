const { AuditLog, User } = require('../models');

const getAllAuditLogs = async () => {
  return await AuditLog.findAll({
    include: [
      {
        model: User,
        attributes: { exclude: ['Password'] },
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};

const getAuditLogById = async (id) => {
  return await AuditLog.findByPk(id, {
    include: [
      {
        model: User,
        attributes: { exclude: ['Password'] },
      },
    ],
  });
};

module.exports = {
  getAllAuditLogs,
  getAuditLogById,
};