import http from "http";
import https from "https";
import cors from "cors";
import express, { Express } from "express";
import logger from "./logger";
import bullboardRoute from "./routes/bullboard.route";
import classesRoute from "./routes/classes.route";
import healthRoute from "./routes/health.route";
import holidaysRoute from "./routes/holidays.route";
import timetablesRoute from "./routes/timetables.route";

let httpServer: http.Server;
let httpsServer: https.Server;

const createApp = (): Express => {
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(async (req, _, next) => {
    logger.info(
      `Serving ${req.method} ${req.path} from ${
        req.headers["x-real-ip"] || req.ip
      }`
    );
    next();
  });
  app.use("/classes", classesRoute);
  app.use("/timetables", timetablesRoute);
  app.use("/holidays", holidaysRoute);
  app.use("/health", healthRoute);
  app.use("/bullboard", bullboardRoute);

  return app;
};

export { createApp, httpServer, httpsServer };
