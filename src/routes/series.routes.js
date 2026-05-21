const express = require('express');
const seriesController = require('../controllers/series.controller');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.get('/', seriesController.getAllSeries);
router.get('/:id', seriesController.getSeriesById);

router.post(
  '/',
  validateRequest(['ItemNoID', 'SeriesName', 'DepartmentID']),
  seriesController.createSeries
);

router.put(
  '/:id',
  validateRequest(['ItemNoID', 'SeriesName', 'DepartmentID']),
  seriesController.updateSeries
);

router.delete('/:id', seriesController.deleteSeries);

module.exports = router;