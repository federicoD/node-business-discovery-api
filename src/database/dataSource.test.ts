import { Business } from "../../src/database/entities/business";
import { DataSource } from "typeorm";

export const TestDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    entities: [Business],
    synchronize: true,
  });