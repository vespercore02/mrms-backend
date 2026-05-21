const agencyFormService = require('../services/agencyForm.service');

const getAllAgencyForms = async (req, res) => {
  try {
    const data = await agencyFormService.getAllAgencyForms();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch agency forms', error: error.message });
  }
};

const getAgencyFormById = async (req, res) => {
  try {
    const data = await agencyFormService.getAgencyFormById(req.params.id);

    if (!data) {
      return res.status(404).json({ success: false, message: 'Agency form not found' });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch agency form', error: error.message });
  }
};

const createAgencyForm = async (req, res) => {
  try {
    const data = await agencyFormService.createAgencyForm(req.body);
    res.status(201).json({ success: true, message: 'Agency form created successfully', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create agency form', error: error.message });
  }
};

const updateAgencyForm = async (req, res) => {
  try {
    const data = await agencyFormService.updateAgencyForm(req.params.id, req.body);

    if (!data) {
      return res.status(404).json({ success: false, message: 'Agency form not found' });
    }

    res.status(200).json({ success: true, message: 'Agency form updated successfully', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update agency form', error: error.message });
  }
};

const deleteAgencyForm = async (req, res) => {
  try {
    const data = await agencyFormService.deleteAgencyForm(req.params.id);

    if (!data) {
      return res.status(404).json({ success: false, message: 'Agency form not found' });
    }

    res.status(200).json({ success: true, message: 'Agency form deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete agency form', error: error.message });
  }
};

module.exports = {
  getAllAgencyForms,
  getAgencyFormById,
  createAgencyForm,
  updateAgencyForm,
  deleteAgencyForm,
};