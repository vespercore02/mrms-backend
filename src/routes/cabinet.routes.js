const express = require("express");
const cabinetController = require("../controllers/cabinet.controller");

const router = express.Router();

router.get("/", cabinetController.getAllCabinets);
router.get("/code/:cabinetCode", cabinetController.getCabinetByCode);
router.get("/:id", cabinetController.getCabinetById);
router.post("/", cabinetController.createCabinet);
router.put("/:id", cabinetController.updateCabinet);
router.delete("/:id", cabinetController.deleteCabinet);

module.exports = router;