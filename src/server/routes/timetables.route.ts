import { add, sub } from "date-fns";
import { Router } from "express";
import { param, query, validationResult } from "express-validator";
import { createEvents } from "ics";
import { Lesson } from "webuntis";
import { convertLessonToEvent, FormatOptions } from "../../utils/time";
import logger from "../logger";
import redis from "../redis";
import untis from "../untis";

const router = Router();

router.get(
  "/:classId",
  param("classId").isNumeric().exists(),
  query("options").isJSON().optional(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params || !req.query) {
      return res.status(400).json({ errors: errors.array() });
    }
    const classId = req.params.classId;
    const options = req.query.options
      ? (JSON.parse(req.query.options) as FormatOptions)
      : {};
    const retrievedTimetable = await redis.get(`timetables.${classId}`);

    if (retrievedTimetable) {
      res
        .status(200)
        .send(createCalendar(JSON.parse(retrievedTimetable), options));
      return;
    }
    logger.info(
      `No cache found for classId ${classId}. Retrieving from untis.`
    );

    const createdTimetable = await getTimetable(
      classId,
      sub(new Date(), { days: 31 }),
      add(new Date(), { days: 31 })
    );
    logger.debug(`Pulled ${createdTimetable?.length} entries.`);
    if (!createdTimetable) {
      return res.status(500).send("Could not retrieve timetable.");
    }
    saveTimetable(classId, JSON.stringify(createdTimetable));
    res.status(200).send(createCalendar(createdTimetable, options));
  }
);

const createCalendar = (
  timetable: Lesson[],
  options: FormatOptions = { subjectFirst: false }
) => {
  return createEvents(
    timetable.map((lesson) => convertLessonToEvent(lesson, options))
  ).value;
};

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
  redis.set(`timetables.${String(classId)}`, events, {
    EX: Number(process.env.CACHE_EXPIRE_TIME) || 3600,
  });
};

export default router;
