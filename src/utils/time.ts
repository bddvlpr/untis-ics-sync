import { add } from "date-fns";
import { DateArray, EventAttributes } from "ics";
import WebUntis, { Holiday, Lesson } from "webuntis";

/* Forgive me, for I have sinned */

interface FormatOptions {
  subjectFirst?: boolean;
  offsetHours?: number;
  excludeClasses?: number[];
}

const convertLessonToEvent = (
  lesson: Lesson,
  options: FormatOptions
): EventAttributes => {
  const classDate = WebUntis.convertUntisDate(lesson.date);
  return {
    uid: String(lesson.id),
    title: options.subjectFirst
      ? `${lesson.su.map((s) => s.longname).join(", ")}\n${lesson.lstext}`
      : `${lesson.lstext}\n${lesson.su.map((s) => s.longname).join(", ")}`,
    location: lesson.ro.map((room) => room.longname).join(", "),
    description: `Subject id: ${lesson.su
      .map((s) => s.id)
      .join(", ")}\nTeacher: ${lesson.te
      .map((teacher) => teacher.longname)
      .join(", ")}\nClasses: ${lesson.kl.map((s) => s.name).join(" ")}`,
    startInputType: "local",
    startOutputType: "local",
    start: convertDateToDateArray(
      add(WebUntis.convertUntisTime(lesson.startTime, classDate), {
        hours: options.offsetHours,
      })
    ),
    endInputType: "local",
    endOutputType: "local",
    end: convertDateToDateArray(
      add(WebUntis.convertUntisTime(lesson.endTime, classDate), {
        hours: options.offsetHours,
      })
    ),
  };
};

const convertHolidayToEvent = (holiday: Holiday): EventAttributes => {
  return {
    uid: String(holiday.id),
    title: holiday.longName,
    description: holiday.name,
    startInputType: "local",
    startOutputType: "local",
    start: convertDateToDateArray(
      WebUntis.convertUntisDate(String(holiday.startDate))
    ),
    endInputType: "local",
    endOutputType: "local",
    end: convertDateToDateArray(
      WebUntis.convertUntisDate(String(holiday.startDate))
    ),
  };
};

const convertDateToDateArray = (date: Date): DateArray => {
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
};

export {
  convertLessonToEvent,
  convertHolidayToEvent,
  convertDateToDateArray,
  FormatOptions,
};
