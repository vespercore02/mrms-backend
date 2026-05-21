const express = require('express');
const specificController = require('../controllers/specific.controller');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.get('/', specificController.getAllSpecifics);
router.get('/:id', specificController.getSpecificById);

router.post(
  '/',
  validateRequest(['SpecificName', 'RetentionPeriod', 'SeriesID']),
  specificController.createSpecific
);

router.put(
  '/:id',
  validateRequest(['SpecificName', 'RetentionPeriod', 'SeriesID']),
  specificController.updateSpecific
);

router.delete('/:id', specificController.deleteSpecific);

module.exports = router;