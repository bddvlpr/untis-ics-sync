import Bull from "bull";
import { convertUnixToDate } from "../utils/time";
import env from "./env";
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
    return await fetchTimetable(
      convertUnixToDate(startUnix),
      convertUnixToDate(endUnix),
      classId
    );
  });
  return timetableQueue;
};

const timetableQueue = createTimetableQueue();

export { timetableQueue, TimetableJob };
