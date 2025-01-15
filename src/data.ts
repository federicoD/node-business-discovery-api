import "reflect-metadata";
import { DataSource } from "typeorm";
import { Business } from "./entities/business";

export const AppDataSource = new DataSource({
  type: "sqlite", // Replace with your database type if not SQLite
  database: "database.sqlite",
  synchronize: true,
  logging: true,
  entities: [Business],
});