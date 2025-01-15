import { createLogger, format, transports } from "winston";

const logger = createLogger({
    level: "info", // TODO: should change if dev or prod
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console() // TODO: should change if dev or prod
    ],
});

export default logger;