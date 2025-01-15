import "reflect-metadata";
import { Business } from "./entities/business";
import { DeepPartial } from "typeorm";
import { AppDataSource } from "./dataSource";
import logger from "../utils/logger";

AppDataSource.initialize()
  .then(async () => {
    const businessRepository = AppDataSource.getRepository(Business);

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
    AppDataSource.destroy();
  })
  .catch((error) => {
    logger.debug("Failed to seed data:", error);
  });
