const express = require("express");
const storageBoxController = require("../controllers/storageBox.controller");

const router = express.Router();

router.get("/available", storageBoxController.getAvailableStorageBoxes);
router.get("/", storageBoxController.getAllStorageBoxes);
router.get("/:id", storageBoxController.getStorageBoxById);
router.post("/", storageBoxController.createStorageBox);
router.put("/:id", storageBoxController.updateStorageBox);
router.delete("/:id", storageBoxController.deleteStorageBox);

module.exports = router;