import { add, sub } from "date-fns";
import { Router } from "express";
import { param, query, validationResult } from "express-validator";
import { createCalendar } from "../../utils/events";
import { convertDateToUnix, FormatOptions } from "../../utils/time";
import env from "../env";
import logger from "../logger";
import { timetableQueue } from "../queue";
import redis from "../redis";

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

    let fetchedTimetableJob = (
      await timetableQueue.getJobs(["waiting", "active", "delayed"])
    ).find((job) => job.data.classId === classId);

    if (!fetchedTimetableJob) {
      logger.debug(`No job found for classId ${classId}. Creating new job.`);
      fetchedTimetableJob = await timetableQueue.add({
        classId,
        startUnix: convertDateToUnix(
          sub(new Date(), {
            days: Number(env.TIMETABLES_PREVIOUS_DAYS),
          })
        ),
        endUnix: convertDateToUnix(
          add(new Date(), {
            days: Number(env.TIMETABLES_FOLLOWING_DAYS),
          })
        ),
      });
    }

    const returnedTimetable = await fetchedTimetableJob.finished();

    if (!returnedTimetable) {
      return res.status(500).send("Could not retrieve timetable.");
    }

    logger.debug(`Pulled ${returnedTimetable.length} entries.`);

    saveCachedTimetable(classId, JSON.stringify(returnedTimetable));
    res.status(200).send(await createCalendar([...returnedTimetable], options));
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
    EX: Number(env.CACHE_EXPIRE_TIME),
  });
};

export default router;
