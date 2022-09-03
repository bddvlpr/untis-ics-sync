import http from "http";
import https from "https";
import cors from "cors";
import express, { Express } from "express";
import logger from "./logger";
import classesRoute from "./routes/classes.route";
import healthRoute from "./routes/health.route";
import timetablesRoute from "./routes/timetables.route";

let httpServer: http.Server;
let httpsServer: https.Server;

const createApp = (): Express => {
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(async (req, _, next) => {
    logger.info(`Serving ${req.method} ${req.path} from ${req.ip}`);
    next();
  });
  app.use("/classes", classesRoute);
  app.use("/timetables", timetablesRoute);
  app.use("/health", healthRoute);

  return app;
};

export { createApp, httpServer, httpsServer };
