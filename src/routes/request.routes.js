const express = require("express");
const requestController = require("../controllers/request.controller");
const validateRequest = require("../middlewares/validateRequest");
const validateStatus = require("../middlewares/validateStatus");

const router = express.Router();

router.get("/", requestController.getAllRequests);
router.get("/:id", requestController.getRequestById);

router.post(
  "/",
  validateRequest(["RequestType", "DepartmentID", "RequestedBy"]),
  requestController.createRequest,
);

router.patch("/:id/storage-location", requestController.assignStorageLocation);

router.put("/:id", requestController.updateRequest);

router.patch("/:id/submit", requestController.submitDraftRequest);

router.patch(
  "/:id/status",
  validateRequest(["Status", "ChangedBy"]),
  validateStatus,
  requestController.updateRequestStatus,
);

router.delete("/:id", requestController.deleteRequest);

module.exports = router;
