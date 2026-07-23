const express = require("express");

const recordsScheduleController = require(
  "../controllers/recordsSchedule.controller",
);


const router = express.Router();

router.get(
  "/",
  recordsScheduleController.getAllRecordsSchedules,
);

router.get(
  "/:id",
  recordsScheduleController.getRecordsScheduleById,
);

router.post(
  "/",
  recordsScheduleController.createRecordsSchedule,
);

router.put(
  "/:id",
  recordsScheduleController.updateRecordsSchedule,
);

router.patch(
  "/:id/deactivate",
  recordsScheduleController.deactivateRecordsSchedule,
);

module.exports = router;