const express = require('express');
const requestController = require('../controllers/request.controller');

const router = express.Router();

router.get('/', requestController.getAllRequests);
router.get('/:id', requestController.getRequestById);
router.post('/', requestController.createRequest);
router.put('/:id', requestController.updateRequest);
router.patch('/:id/status', requestController.updateRequestStatus);
router.delete('/:id', requestController.deleteRequest);

module.exports = router;