import dotenv from "dotenv";
import { createClient } from "redis";
import logger from "./logger";

const createRedis = () => {
  dotenv.config();
  const client = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  });

  client.on("error", (err) => {
    logger.error(`Redis error: ${err}`);
  });

  client.connect();
  return client;
};

export default createRedis();
