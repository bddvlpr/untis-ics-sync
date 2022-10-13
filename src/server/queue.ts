import Bull from "bull";
import { convertUnixToDate } from "../utils/time";
import env from "./env";
import logger from "./logger";
import { fetchTimetable } from "./retriever";

interface TimetableJob {
  classId: number;
  startUnix: number;
  endUnix: number;
}

const createTimetableQueue = () => {
  const timetableQueue = new Bull<TimetableJob>("timetable", env.REDIS_URI);
  timetableQueue.process(async (job) => {
    const { classId, startUnix, endUnix } = job.data;
    const start = convertUnixToDate(startUnix),
      end = convertUnixToDate(endUnix);

    logger.info(
      `Fetching timetable for classId ${classId}, ${start}, ${end}...`
    );
    return await fetchTimetable(start, end, classId);
  });
  return timetableQueue;
};

const timetableQueue = createTimetableQueue();

export { timetableQueue };
