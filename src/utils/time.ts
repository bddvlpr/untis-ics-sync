import { add } from "date-fns";
import { Alarm, DateArray, EventAttributes } from "ics";
import WebUntis, { Holiday, Lesson } from "webuntis";

/* Forgive me, for I have sinned */

interface FormatOptions {
  offsetHours?: number;
  excludeClasses?: number[];
  notifyBefore?: number;
}

const convertLessonToEvent = (
  lesson: Lesson,
  options: FormatOptions
): EventAttributes => {
  const classDate = WebUntis.convertUntisDate(lesson.date);
  return {
    uid: String(lesson.id),
    title: createTitle(lesson),
    location: lesson.ro.map((room) => room.longname).join(", "),
    description: createDescription(lesson),
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
    alarms: createAlarms(options),
  };
};

const createTitle = (lesson: Lesson): string => {
  const title = [];

  if (lesson.su && lesson.su.length > 0)
    title.push(lesson.su.map((subject) => subject.longname).join(", "));

  if (lesson.lstext) title.push(`(${lesson.lstext})`);

  return title.join(" ");
};

const createDescription = (lesson: Lesson): string => {
  const description = [];

  // Apparently lesson.te can be undefined even though the types say otherwise.
  if (lesson.te && lesson.te.length > 0)
    description.push(
      `Teacher(s): ${lesson.te.map((teacher) => teacher.longname).join(", ")}`
    );

  // Apparently lesson.kl can be undefined even though the types say otherwise.
  if (lesson.kl && lesson.kl.length > 0)
    description.push(
      `Class(es): ${lesson.kl.map((klasse) => klasse.longname).join(", ")}`
    );

  if (lesson.su && lesson.su.length > 0)
    description.push(
      `Subject(s): ${lesson.su
        .map((subject) => `${subject.longname} (${subject.id})`)
        .join(", ")}`
    );

  return description.join("\n");
};

const createAlarms = (options: FormatOptions): Alarm[] => {
  if (!options.notifyBefore) return [];

  return [
    {
      action: "display",
      trigger: {
        minutes: options.notifyBefore,
        before: true,
      },
    },
  ];
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
