const express = require('express');
const filePathController = require('../controllers/filePath.controller');

const router = express.Router();

router.get('/', filePathController.getAllFilePaths);
router.get('/:id', filePathController.getFilePathById);
router.post('/', filePathController.createFilePath);
router.put('/:id', filePathController.updateFilePath);
router.delete('/:id', filePathController.deleteFilePath);

module.exports = router;