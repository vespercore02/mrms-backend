const express = require('express');
const agencyFormController = require('../controllers/agencyForm.controller');

const router = express.Router();

router.get('/', agencyFormController.getAllAgencyForms);
router.get('/:id', agencyFormController.getAgencyFormById);
router.post('/', agencyFormController.createAgencyForm);
router.put('/:id', agencyFormController.updateAgencyForm);
router.delete('/:id', agencyFormController.deleteAgencyForm);

module.exports = router;