import { add, sub } from "date-fns";
import { Router } from "express";
import { param, query, validationResult } from "express-validator";
import { createCalendar } from "../../utils/events";
import { FormatOptions } from "../../utils/time";
import env from "../env";
import logger from "../logger";
import redis from "../redis";
import { fetchTimetable } from "../retriever";

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

    const retrievedTimetable = await getCachedTimetable(classId);
    if (retrievedTimetable) {
      res
        .status(200)
        .send(await createCalendar(JSON.parse(retrievedTimetable), options));
      return;
    }

    logger.info(
      `No cache found for classId ${classId}. Attempting to gather from untis.`
    );

    const createdTimetable = await fetchTimetable(
      sub(new Date(), {
        days: Number(env.TIMETABLES_PREVIOUS_DAYS) || 7,
      }),
      add(new Date(), {
        days: Number(env.TIMETABLES_FOLLOWING_DAYS) || 25,
      }),
      classId
    );

    if (!createdTimetable) {
      return res.status(500).send("Could not retrieve timetable.");
    }

    logger.debug(`Pulled ${createdTimetable.length} entries.`);

    saveCachedTimetable(classId, JSON.stringify(createdTimetable));
    res.status(200).send(await createCalendar([...createdTimetable], options));
  }
);

const getCachedTimetable = async (classId: number) => {
  const retrievedTimetable = await redis.get(`timetables.${classId}`);

  if (retrievedTimetable) {
    logger.debug(`Found cache for classId ${classId}.`);
    return retrievedTimetable;
  }
};

const saveCachedTimetable = async (classId: number, events: string) => {
  redis.set(`timetables.${String(classId)}`, events, {
    EX: Number(process.env.CACHE_EXPIRE_TIME) || 3600,
  });
};

export default router;
