import Bull from "bull";
import { convertUnixToDate } from "../utils/time";
import env from "./env";
import { fetchClasses, fetchHolidays, fetchTimetable } from "./retriever";

interface TimetableJob {
  classId: number;
  startUnix: number;
  endUnix: number;
}

const createTimetableQueue = () => {
  const timetableQueue = new Bull<TimetableJob>("timetable", env.REDIS_URI);
  timetableQueue.process(async (job) => {
    const { classId, startUnix, endUnix } = job.data;
    return await fetchTimetable(
      convertUnixToDate(startUnix),
      convertUnixToDate(endUnix),
      classId
    );
  });
  return timetableQueue;
};

const createClassesQueue = () => {
  const classesQueue = new Bull("classes", env.REDIS_URI);
  classesQueue.process(async () => {
    return await fetchClasses();
  });
  return classesQueue;
};

const createHolidaysQueue = () => {
  const holidaysQueue = new Bull("holidays", env.REDIS_URI);
  holidaysQueue.process(async () => {
    return await fetchHolidays();
  });
  return holidaysQueue;
};

const timetableQueue = createTimetableQueue();
const classesQueue = createClassesQueue();
const holidaysQueue = createHolidaysQueue();

export { timetableQueue, classesQueue, holidaysQueue, TimetableJob };
