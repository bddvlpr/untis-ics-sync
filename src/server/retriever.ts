import { add } from "date-fns";
import { Lesson } from "webuntis";
import { convertDateToString } from "../utils/time";
import logger from "./logger";
import untis from "./untis";

const fetchClasses = async () => {
  await untis.login();
  return await untis.getClasses();
};

const fetchHolidays = async () => {
  await untis.login();
  return await untis.getHolidays();
};

const fetchTimetable = async (start: Date, end: Date, classId: number) => {
  return (
    (await fetchTimetableInstant(start, end, classId)) ||
    (await fetchTimetableIndividually(start, end, classId))
  );
};

const fetchTimetableInstant = async (
  start: Date,
  end: Date,
  classId: number
) => {
  try {
    logger.info(
      `(${classId}) Fetching timetable for ${convertDateToString(
        start
      )} to ${convertDateToString(end)} instantly.`
    );
    await untis.login();

    const timetable = await untis.getTimetableForRange(start, end, classId, 1);
    return timetable;
  } catch (err) {
    logger.error(err);
  }
};

const fetchTimetableIndividually = async (
  start: Date,
  end: Date,
  classId: number
) => {
  try {
    logger.info(
      `(${classId}) Fetching timetable from ${convertDateToString(
        start
      )} to ${convertDateToString(end)} individually.`
    );
    await untis.login();

    const timetable: Lesson[] = [];
    for (let date = start; date <= end; date = add(date, { days: 1 })) {
      try {
        logger.info(
          `(${classId}) Fetching timetable for ${convertDateToString(date)}.`
        );
        const lessons = await untis.getTimetableFor(date, classId, 1);
        timetable.push(...lessons);
        logger.info(`(${classId}) Fetched ${lessons.length} lessons.`);
      } catch (err) {
        logger.warn(err);
      }
    }
    return timetable;
  } catch (err) {
    logger.error(err);
  }
};

export { fetchClasses, fetchHolidays, fetchTimetable };
