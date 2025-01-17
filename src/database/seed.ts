import "reflect-metadata";
import { Business } from "./entities/business";
import { DataSource, DeepPartial } from "typeorm";
import logger from "../utils/logger";
import { getDataSource } from "../utils/dataSourceProvider";

const dataSource: DataSource = getDataSource();

dataSource.initialize()
  .then(async () => {
    const businessRepository = dataSource.getRepository(Business);

    const businesses : DeepPartial<Business>[] = [
      {
        name: "Joe's Coffee",
        latitude: 40.7128,
        longitude: -74.006,
        type: "coffee",
      },
      {
        name: "Central Perk",
        latitude: 40.7306,
        longitude: -73.9867,
        type: "coffee",
      },
      {
        name: "Tasty Bites",
        latitude: 40.758,
        longitude: -73.9855,
        type: "restaurant",
      },
    ];

    for (const business of businesses) {
      const newBusiness = businessRepository.create(business);
      await businessRepository.save(newBusiness);
    }

    logger.debug("Seed data added!");
    dataSource.destroy();
  })
  .catch((error) => {
    logger.debug("Failed to seed data:", error);
  });
