import { add, sub } from "date-fns";
import { Router } from "express";
import { param, query, validationResult } from "express-validator";
import { createEvents } from "ics";
import { Lesson } from "webuntis";
import { convertLessonToEvent, FormatOptions } from "../../utils/time";
import logger from "../logger";
import redis from "../redis";
import { getTimetables, getTimetablesSeperately } from "../retriever";

let retrievingLock = false;

const router = Router();

router.get(
  "/:classId",
  param("classId").isNumeric().exists(),
  query("options").isJSON().optional(),
  query("insecure").isBoolean().optional(),
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
      `No cache found for classId ${classId}. Attempting to gather from untis.`
    );

    if (!retrievingLock) {
      retrievingLock = true;
      try {
        const dateStart = sub(new Date(), {
          days: Number(process.env.TIMETABLES_PREVIOUS_DAYS) || 7,
        });
        const dateEnd = add(new Date(), {
          days: Number(process.env.TIMETABLES_FOLLOWING_DAYS) || 25,
        });

        const createdTimetable = await (req.query.insecure
          ? getTimetables(dateStart, dateEnd, classId)
          : getTimetablesSeperately(dateStart, dateEnd, classId));
        logger.debug(`Pulled ${createdTimetable?.length} entries.`);
        if (!createdTimetable) {
          return res.status(500).send("Could not retrieve timetable.");
        }
        saveTimetable(classId, JSON.stringify(createdTimetable));
        res.status(200).send(createCalendar(createdTimetable, options));
      } finally {
        retrievingLock = false;
      }
    }
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

const saveTimetable = async (classId: number, events: string) => {
  redis.set(`timetables.${String(classId)}`, events, {
    EX: Number(process.env.CACHE_EXPIRE_TIME) || 3600,
  });
};

export default router;
