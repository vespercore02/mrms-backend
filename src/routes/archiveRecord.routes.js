const express = require('express');
const archiveRecordController = require('../controllers/archiveRecord.controller');

const router = express.Router();

router.get('/', archiveRecordController.getAllArchiveRecords);
router.get('/:id', archiveRecordController.getArchiveRecordById);
router.post('/', archiveRecordController.createArchiveRecord);
router.patch('/:id/status', archiveRecordController.updateArchiveStatus);
router.delete('/:id', archiveRecordController.deleteArchiveRecord);

module.exports = router;