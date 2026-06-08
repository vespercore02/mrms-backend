const express = require("express");
const requestFormController = require("../controllers/requestForm.controller");

const router = express.Router();

router.get("/", requestFormController.getAllRequestForms);
router.get("/:id", requestFormController.getRequestFormById);
router.post("/", requestFormController.createRequestForm);
router.put("/:id", requestFormController.updateRequestForm);
router.patch("/:id/submit", requestFormController.submitRequestForm);
router.patch("/:id/review", requestFormController.reviewRequestForm);
router.patch("/:id/approve", requestFormController.approveRequestForm);
router.delete("/:id", requestFormController.deleteRequestForm);

module.exports = router;