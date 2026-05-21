const express = require('express');
const seriesController = require('../controllers/series.controller');

const router = express.Router();

router.get('/', seriesController.getAllSeries);
router.get('/:id', seriesController.getSeriesById);
router.post('/', seriesController.createSeries);
router.put('/:id', seriesController.updateSeries);
router.delete('/:id', seriesController.deleteSeries);

module.exports = router;