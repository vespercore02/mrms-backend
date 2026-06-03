const express = require("express");
const cabinetBayController = require("../controllers/cabinetBay.controller");

const router = express.Router();

router.get("/", cabinetBayController.getAllCabinetBays);
router.get("/:id", cabinetBayController.getCabinetBayById);
router.post("/", cabinetBayController.createCabinetBay);
router.put("/:id", cabinetBayController.updateCabinetBay);
router.patch("/:id/status", cabinetBayController.updateCabinetBayStatus);
router.delete("/:id", cabinetBayController.deleteCabinetBay);

module.exports = router;