import dotenv from "dotenv";
import { createClient } from "redis";
import env from "./env";
import logger from "./logger";

const createRedis = () => {
  dotenv.config();
  const client = createClient({
    url: env.REDIS_URI,
  });

  client.on("error", (err) => {
    logger.error(`Redis error: ${err}`);
  });

  client.connect();
  return client;
};

export default createRedis();
