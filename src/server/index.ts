import express from "express";
import logger from "./logger";

const createServer = (port: number) => {
  const app = express();

  app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });
};

export { createServer };
