const express = require('express');
const dataListController = require('../controllers/dataList.controller');

const router = express.Router();

router.get('/', dataListController.getAllDataLists);
router.post('/bulk-import', dataListController.bulkCreateDataLists);
router.get('/:id', dataListController.getDataListById);
router.post('/', dataListController.createDataList);
router.put('/:id', dataListController.updateDataList);
router.delete('/:id', dataListController.deleteDataList);

module.exports = router;