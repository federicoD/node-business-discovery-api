import "reflect-metadata";
import { AppDataSource } from "./database/dataSource";
import app from "./app";
import logger from "./utils/logger";

const PORT = process.env.PORT || 4321;

AppDataSource.initialize()
  .then(() => {
    logger.debug("Connected to the database!");

    app.listen(PORT, () => {
      logger.debug(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Database connection failed:", error);
  });