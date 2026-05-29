const {
  ArchiveRecord,
  ArchiveStatusHistory,
  DataList,
  User,
  AgencyForm,
} = require("../models");

const getAllArchiveRecords = async () => {
  return await ArchiveRecord.findAll({
    include: [
      {
        model: DataList,
        include: [AgencyForm],
      },
      {
        model: ArchiveStatusHistory,
        include: [
          {
            model: User,
            attributes: { exclude: ["Password"] },
          },
        ],
      },
      {
        model: User,
        attributes: { exclude: ["Password"] },
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const getArchiveRecordById = async (id) => {
  return await ArchiveRecord.findByPk(id, {
    include: [
      {
        model: DataList,
        include: [AgencyForm],
      },
      {
        model: ArchiveStatusHistory,
        include: [
          {
            model: User,
            attributes: { exclude: ["Password"] },
          },
        ],
      },
      {
        model: User,
        attributes: { exclude: ["Password"] },
      },
    ],
  });
};

const createArchiveRecord = async (payload) => {
  const existingArchive = await ArchiveRecord.findOne({
    where: {
      DataListID: payload.DataListID,
    },
  });

  if (existingArchive) {
    const error = new Error("This data list record is already archived");
    error.statusCode = 400;
    throw error;
  }

  return await ArchiveRecord.create(payload);
};

const updateArchiveStatus = async (id, payload) => {
  const archiveRecord = await ArchiveRecord.findByPk(id);

  if (!archiveRecord) return null;

  const oldStatus = archiveRecord.ArchiveStatus;

  await archiveRecord.update({
    ArchiveStatus: payload.ArchiveStatus,
    ReviewDate: payload.ReviewDate || archiveRecord.ReviewDate,
    DisposalDate: payload.DisposalDate || archiveRecord.DisposalDate,
    Reason: payload.Reason || archiveRecord.Reason,
    Remarks: payload.Remarks || archiveRecord.Remarks,
  });

  await ArchiveStatusHistory.create({
    ArchiveRecordID: archiveRecord.ArchiveRecordID,
    OldStatus: oldStatus,
    NewStatus: payload.ArchiveStatus,
    Remarks: payload.Remarks || null,
    ChangedBy: payload.ChangedBy || null,
  });

  return archiveRecord;
};

const deleteArchiveRecord = async (id) => {
  const archiveRecord = await ArchiveRecord.findByPk(id);

  if (!archiveRecord) return null;

  await archiveRecord.destroy();
  return archiveRecord;
};

module.exports = {
  getAllArchiveRecords,
  getArchiveRecordById,
  createArchiveRecord,
  updateArchiveStatus,
  deleteArchiveRecord,
};
