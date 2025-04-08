import { createLogger, format as _format, transports as _transports } from "winston";

const logger = createLogger({
  level: "info", // Log info and above (warn, error)
  format: _format.combine(
    _format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    _format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new _transports.Console(), // Log to console
    new _transports.File({ filename: "logs/error.log", level: "error" }), // Error logs to file
    new _transports.File({ filename: "logs/combined.log" }), // All logs to file
  ],
});

export default logger;
