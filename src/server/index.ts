import cors from "cors";
import express from "express";
import http from "http";
import https from "https";
import fs from "fs";
import logger from "./logger";
import classesRoute from "./routes/classes.route";
import healthRoute from "./routes/health.route";
import timetablesRoute from "./routes/timetables.route";

let httpServer: http.Server;
let httpsServer: https.Server;

const createServer = (httpPort: number, httpsPort: number) => {
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(async (req, _, next) => {
    logger.info(`Serving ${req.method} ${req.path} from ${req.ip}`);
    next();
  });
  app.use("/classes", classesRoute);
  app.use("/timetables", timetablesRoute);
  app.use("/health", healthRoute);

  if (process.env.ENABLE_HTTP === "true") {
    httpServer = http
      .createServer(app)
      .listen(httpPort, () =>
        logger.info(`Server listening on port (HTTP) ${httpPort}`)
      );
  }

  if (process.env.ENABLE_HTTPS === "true") {
    httpsServer = https
      .createServer(
        {
          key: fs.readFileSync("./ssl/key.pem"),
          cert: fs.readFileSync("./ssl/cert.pem"),
        },
        app
      )
      .listen(httpsPort, () => {
        logger.info(`Server listening on port (HTTPS) ${httpsPort}`);
      });
  }

  process.on("SIGTERM", () => {
    logger.info("Sigterm recieved. Shutting down...");
    if (httpServer) httpServer.close();
    if (httpsServer) httpsServer.close();
    process.exit();
  });
};

export { createServer, httpServer, httpsServer };
