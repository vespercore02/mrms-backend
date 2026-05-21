const express = require('express');
const specificController = require('../controllers/specific.controller');

const router = express.Router();

router.get('/', specificController.getAllSpecifics);
router.get('/:id', specificController.getSpecificById);
router.post('/', specificController.createSpecific);
router.put('/:id', specificController.updateSpecific);
router.delete('/:id', specificController.deleteSpecific);

module.exports = router;