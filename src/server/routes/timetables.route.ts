import { add, sub } from "date-fns";
import { Router } from "express";
import { param, query, validationResult } from "express-validator";
import { createEvents } from "ics";
import { Lesson } from "webuntis";
import {
  convertHolidayToEvent,
  convertLessonToEvent,
  FormatOptions,
} from "../../utils/time";
import env from "../env";
import logger from "../logger";
import redis from "../redis";
import {
  getHolidays,
  getTimetables,
  getTimetablesSeperately,
} from "../retriever";

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
        .send(await createCalendar(JSON.parse(retrievedTimetable), options));
      return;
    }
    logger.info(
      `No cache found for classId ${classId}. Attempting to gather from untis.`
    );

    if (!retrievingLock) {
      retrievingLock = true;
      try {
        const dateStart = sub(new Date(), {
          days: Number(env.TIMETABLES_PREVIOUS_DAYS) || 7,
        });
        const dateEnd = add(new Date(), {
          days: Number(env.TIMETABLES_FOLLOWING_DAYS) || 25,
        });

        const createdTimetable = await (req.query.insecure
          ? getTimetables(dateStart, dateEnd, classId)
          : getTimetablesSeperately(dateStart, dateEnd, classId));
        logger.debug(`Pulled ${createdTimetable?.length} entries.`);
        if (!createdTimetable) {
          return res.status(500).send("Could not retrieve timetable.");
        }
        saveTimetable(classId, JSON.stringify(createdTimetable));
        res
          .status(200)
          .send(await createCalendar([...createdTimetable], options));
      } finally {
        retrievingLock = false;
      }
    }
  }
);

const createCalendar = async (timetable: Lesson[], options: FormatOptions) => {
  // TODO: This is a very inefficient way of merging lessons. It should be done in the retriever if possible.
  timetable.forEach((lesson) => {
    timetable
      .filter(
        (nextLesson) =>
          nextLesson.date === lesson.date &&
          nextLesson.lsnumber === lesson.lsnumber
      )
      .forEach((nextLesson) => {
        if (nextLesson.startTime === lesson.endTime) {
          logger.info(`Merging ${lesson.id} with ${nextLesson.id}.`);
          lesson.endTime = nextLesson.endTime;
          timetable.splice(timetable.indexOf(nextLesson), 1);
        }
      });
  });

  return createEvents([
    ...timetable
      .filter((lesson) => {
        if (options?.excludeClasses) {
          return !lesson.su.some((su) =>
            options.excludeClasses?.includes(su.id)
          );
        }
        return true;
      })
      .map((lesson) => convertLessonToEvent(lesson, options)),
    ...(await getHolidays()).map((holiday) => convertHolidayToEvent(holiday)),
  ]).value;
};

const saveTimetable = async (classId: number, events: string) => {
  redis.set(`timetables.${String(classId)}`, events, {
    EX: Number(process.env.CACHE_EXPIRE_TIME) || 3600,
  });
};

export default router;
