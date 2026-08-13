const express = require("express");
const rdsController = require("../controllers/rds.controller");

const router = express.Router();

router.get("/filters", rdsController.getRdsFilters);

router.get("/", rdsController.getAllRdsEntries);

router.get("/:id", rdsController.getRdsEntryById);

module.exports = router;