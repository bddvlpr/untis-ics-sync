import { createEvents } from "ics";
import { Lesson } from "webuntis";
import logger from "../server/logger";
import { getHolidays } from "../server/retriever";
import {
  convertHolidayToEvent,
  convertLessonToEvent,
  FormatOptions,
} from "./time";

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
          logger.debug(`Merging ${lesson.id} with ${nextLesson.id}.`);
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

export { createCalendar };
