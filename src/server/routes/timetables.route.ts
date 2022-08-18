import { add } from "date-fns";
import { Router } from "express";
import { param, validationResult } from "express-validator";
import { createEvents } from "ics";
import { convertLessonToEvent } from "../../utils/time";
import logger from "../logger";
import redis from "../redis";
import untis from "../untis";

const router = Router();

router.get(
  "/:classId",
  param("classId").isNumeric().exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params) {
      return res.status(400).json({ errors: errors.array() });
    }
    const classId = req.params.classId;
    const retrievedTimetable = await redis.get(classId);

    if (retrievedTimetable) {
      res.status(200).send(retrievedTimetable);
      return;
    }
    logger.info(
      `No cache found for classId ${classId}. Retrieving from untis.`
    );

    const createdTimetable = await getTimetable(
      classId,
      new Date(),
      add(new Date(), { days: 14 })
    );
    if (!createdTimetable) {
      return res.status(500).send("Could not retrieve timetable.");
    }

    const events = createEvents(createdTimetable.map(convertLessonToEvent));
    if (events.error) {
      return res.status(500).send("Could not create events.");
    }
    saveTimetable(classId, events.value as string);
    res.status(200).send(events.value);
  }
);

const getTimetable = async (
  classId: number,
  dateStart: Date,
  dateEnd: Date
) => {
  try {
    await untis.login();
    const timetable = await untis.getTimetableForRange(
      dateStart,
      dateEnd,
      classId,
      1
    );

    return timetable;
  } catch (err) {
    logger.error(err);
  }
};

const saveTimetable = async (classId: number, events: string) => {
  redis.set(String(classId), events, {
    EX: Number(process.env.CACHE_EXPIRE_TIME) || 3600,
  });
};

export default router;
