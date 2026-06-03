const express = require("express");
const boxRecordController = require("../controllers/boxRecord.controller");

const router = express.Router();

router.get("/", boxRecordController.getAllBoxRecords);
router.get("/:id", boxRecordController.getBoxRecordById);
router.post("/", boxRecordController.assignDataListToBox);
router.put("/:id", boxRecordController.updateBoxRecord);
router.delete("/:id", boxRecordController.deleteBoxRecord);

module.exports = router;