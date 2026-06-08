const express = require("express");
const requestV2FoundationController = require("../controllers/requestV2Foundation.controller");

const router = express.Router();

router.get("/request-types", requestV2FoundationController.getAllRequestTypes);

router.get(
  "/request-types/code/:code",
  requestV2FoundationController.getRequestTypeByCode
);

router.get("/request-types/:id", requestV2FoundationController.getRequestTypeById);

router.get("/form-types", requestV2FoundationController.getAllFormTypes);

router.get(
  "/request-types/:requestTypeId/required-forms",
  requestV2FoundationController.getRequiredFormsByRequestType
);

module.exports = router;