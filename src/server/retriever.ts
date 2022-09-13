import { add } from "date-fns";
import { Lesson } from "webuntis";
import logger from "./logger";
import untis from "./untis";

const getTimetables = async (
  dateStart: Date,
  dateEnd: Date,
  classId: number
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
    return [];
  }
};

// Since Untis does not always give a response to the one big request, make individual requests for each day that *might* fail.
const getTimetablesSeperately = async (
  dateStart: Date,
  dateEnd: Date,
  classId: number
) => {
  try {
    await untis.login();

    const timetable: Lesson[] = [];
    for (let date = dateStart; date <= dateEnd; date = add(date, { days: 1 })) {
      try {
        logger.info(`Fetching timetable for ${date}.`);
        const lessons = await untis.getTimetableFor(date, classId, 1);
        timetable.push(...lessons);
        logger.info(`Fetched ${lessons.length} lessons.`);
      } catch (err) {
        logger.warn(err);
      }
    }
    return timetable;
  } catch (err) {
    logger.error(err);
    return [];
  }
};

const getHolidays = async () => {
  await untis.login();
  return await untis.getHolidays();
};

export { getTimetables, getTimetablesSeperately, getHolidays };
