import { DataSource } from "typeorm";
import { AppDataSource } from "../database/dataSource";
import dotenv from "dotenv";
import { TestDataSource } from "../database/dataSource.test";

dotenv.config();

export const getDataSource = (): DataSource => {
  return process.env.NODE_ENV === "test" ? TestDataSource : AppDataSource;
};
