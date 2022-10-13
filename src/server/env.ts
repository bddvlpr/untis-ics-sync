import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

export default z
  .object({
    REDIS_URI: z.string().default("redis://redis:6379"),
    UNTIS_SCHOOL: z.string().min(1),
    UNTIS_USERNAME: z.string().optional(),
    UNTIS_PASSWORD: z.string().optional(),
    UNTIS_BASEURL: z.string().min(1),

    TIMETABLES_FOLLOWING_DAYS: z.string().transform((value) => parseInt(value)),
    TIMETABLES_PREVIOUS_DAYS: z.string().transform((value) => parseInt(value)),

    BULLBOARD_PASSWORD: z.string().optional(),

    CACHE_EXPIRE_TIME: z.string().transform((value) => parseInt(value)),
  })
  .parse(process.env);
