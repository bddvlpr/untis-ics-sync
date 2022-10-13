import { Router } from "express";
import { createEvents } from "ics";
import { Holiday } from "webuntis";
import { convertHolidayToEvent } from "../../utils/time";
import { holidaysQueue } from "../queue";

const router = Router();

router.use("/", async (req, res) => {
  const holidaysJobs = await holidaysQueue.getJobs([
    "waiting",
    "active",
    "delayed",
  ]);

  const holidaysJob = holidaysJobs.length
    ? holidaysJobs[0]
    : await holidaysQueue.add({});
  const holidays = await holidaysJob.finished();

  if (!holidays) {
    return res.status(500).send("Could not retrieve holidays.");
  }

  res
    .status(200)
    .send(
      createEvents(
        holidays.map((holiday: Holiday) => convertHolidayToEvent(holiday))
      ).value
    );
});

export default router;
