const express = require("express");
const multer = require("multer");

const recordsScheduleImportController = require(
  "../controllers/recordsScheduleImport.controller",
);

const router = express.Router();

const upload = multer({
  dest: "uploads/rds-imports/",
});

router.post(
  "/:id/import-preview",
  upload.single("file"),
  recordsScheduleImportController.previewImport,
);

router.post(
  "/:id/import-confirm",
  recordsScheduleImportController.confirmImport,
);

router.post(
  "/:id/import-direct",
  upload.single("file"),
  recordsScheduleImportController.importDirect,
);

module.exports = router;