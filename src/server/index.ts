import cors from "cors";
import express from "express";
import logger from "./logger";
import classesRoute from "./routes/classes.route";
import timetablesRoute from "./routes/timetables.route";

const createServer = (port: number) => {
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(async (req, _, next) => {
    logger.info(`Serving ${req.method} ${req.path} from ${req.ip}`);
    next();
  });
  app.use("/classes", classesRoute);
  app.use("/timetables", timetablesRoute);

  const server = app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });

  process.on("SIGTERM", () => {
    logger.info("Sigterm recieved. Shutting down...");
    server.close(() => process.exit());
  });
};

export { createServer };
