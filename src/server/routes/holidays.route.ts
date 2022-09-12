import { Router } from "express";
import { createEvents } from "ics";
import { convertHolidayToEvent } from "../../utils/time";
import untis from "../untis";

const router = Router();

router.use("/", async (req, res) => {
  const holidays = await untis.getHolidays();
  const events = createEvents(
    holidays.map((holiday) => {
      return convertHolidayToEvent(holiday);
    })
  );

  res.send(events.value);
});

export default router;
