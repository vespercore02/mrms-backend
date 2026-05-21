const express = require('express');
const requestController = require('../controllers/request.controller');
const validateRequest = require('../middlewares/validateRequest');
const validateStatus = require('../middlewares/validateStatus');

const router = express.Router();

router.get('/', requestController.getAllRequests);
router.get('/:id', requestController.getRequestById);

router.post(
  '/',
  validateRequest(['RequestType', 'AgencyUniqueID', 'RequestedBy']),
  requestController.createRequest
);

router.put('/:id', requestController.updateRequest);

router.patch(
  '/:id/status',
  validateRequest(['Status', 'ChangedBy']),
  validateStatus,
  requestController.updateRequestStatus
);

router.delete('/:id', requestController.deleteRequest);

module.exports = router;