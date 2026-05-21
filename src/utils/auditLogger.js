const { AuditLog } = require('../models');

const createAuditLog = async ({
  action,
  tableName,
  recordId,
  oldValue = null,
  newValue = null,
  performedBy = null,
}) => {
  try {
    await AuditLog.create({
      Action: action,
      TableName: tableName,
      RecordID: recordId ? String(recordId) : null,
      OldValue: oldValue,
      NewValue: newValue,
      PerformedBy: performedBy,
    });
  } catch (error) {
    console.error('Audit log failed:', error.message);
  }
};

module.exports = createAuditLog;