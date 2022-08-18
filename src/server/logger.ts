import { createLogger, format, transports } from "winston";

const createLevel = () =>
  (process.env.NODE_ENV || "unknown") === "production" ? "info" : "debug";

const createLevels = () => ({
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
});

const createFormat = () =>
  format.combine(
    format.timestamp(),
    format.colorize({ all: true }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  );

const createTransports = () => new transports.Console();

const createLog = () =>
  createLogger({
    level: createLevel(),
    levels: createLevels(),
    format: createFormat(),
    transports: createTransports(),
  });

export default createLog();
