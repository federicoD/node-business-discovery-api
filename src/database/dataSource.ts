import "reflect-metadata";
import { DataSource } from "typeorm";
import { Business } from "./entities/business";
import logger from "../utils/logger";
import dotenv from "dotenv";

dotenv.config();

const dbFile: string = process.env.DB_FILE || "database.sqlite";

// Enable logging only when the environment is not production
const dbLoggingEnabled = process.env.NODE_ENV != "production";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: dbFile,
  synchronize: true,
  logging: dbLoggingEnabled,
  entities: [Business]
});