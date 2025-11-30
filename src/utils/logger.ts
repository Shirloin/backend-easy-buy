import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Define log format
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${stack || message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: combine(
        errors({ stack: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    defaultMeta: { service: "easy-buy-backend" },
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                logFormat
            ),
        }),
        // Write all logs with level 'error' and below to error.log
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            format: combine(timestamp(), logFormat),
        }),
        // Write all logs to combined.log
        new winston.transports.File({
            filename: "logs/combined.log",
            format: combine(timestamp(), logFormat),
        }),
    ],
});

// If we're not in production, log to console with simpler format
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

export default logger;

