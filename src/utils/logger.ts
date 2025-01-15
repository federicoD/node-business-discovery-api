import { createLogger, format, transports } from "winston";
import dotenv from "dotenv";

dotenv.config();

const loggingLevel: string = process.env.NODE_ENV == "production" ? "warn" : "debug";

const logger = createLogger({
    level: loggingLevel,
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console() // TODO: should change if dev or prod
    ],
});

export default logger;