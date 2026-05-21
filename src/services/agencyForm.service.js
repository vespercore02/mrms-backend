const { AgencyForm, DataList, FilePath } = require('../models');

const getAllAgencyForms = async () => {
  return await AgencyForm.findAll({
    include: [DataList, FilePath],
  });
};

const getAgencyFormById = async (id) => {
  return await AgencyForm.findByPk(id, {
    include: [DataList, FilePath],
  });
};

const createAgencyForm = async (payload) => {
  return await AgencyForm.create(payload);
};

const updateAgencyForm = async (id, payload) => {
  const agencyForm = await AgencyForm.findByPk(id);
  if (!agencyForm) return null;

  await agencyForm.update(payload);
  return agencyForm;
};

const deleteAgencyForm = async (id) => {
  const agencyForm = await AgencyForm.findByPk(id);
  if (!agencyForm) return null;

  await agencyForm.destroy();
  return agencyForm;
};

module.exports = {
  getAllAgencyForms,
  getAgencyFormById,
  createAgencyForm,
  updateAgencyForm,
  deleteAgencyForm,
};