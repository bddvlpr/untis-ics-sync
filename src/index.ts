import http from "http";
import { createApp } from "./server";
import logger from "./server/logger";

(() => {
  const app = createApp();

  const server = http.createServer(app).listen(3000, () => {
    logger.info("Server listening on port 3000.");
  });

  process.on("SIGTERM", () => {
    logger.info("Shutting down server(s)...");
    server.close();
    process.exit(0);
  });

  process.on("uncaughtException", (err: Error) => {
    logger.error(err);
  });
})();
