import "reflect-metadata";
import { DataSource } from "typeorm";
import { Business } from "./entities/business";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: true, // TODO: should be based on the environment
  entities: [Business]
});