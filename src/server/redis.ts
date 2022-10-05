import dotenv from "dotenv";
import { createClient } from "redis";
import logger from "./logger";

const createRedis = () => {
  dotenv.config();
  const client = createClient({
    url: process.env.REDIS_URI,
  });

  client.on("error", (err) => {
    logger.error(`Redis error: ${err}`);
  });

  client.connect();
  return client;
};

export default createRedis();
