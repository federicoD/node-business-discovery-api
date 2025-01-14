import "reflect-metadata";
import { createConnection, DeepPartial } from "typeorm";
import { Business } from "./entities/business";
// import { AppDataSource } from "./entities";

createConnection()
  .then(async (connection) => {
    const businessRepository = connection.getRepository(Business);

    const businesses : DeepPartial<Business>[] = [
      { name: "Joe's Coffee", latitude: 40.7128, longitude: -74.006, type: "coffee" },
      { name: "Central Perk", latitude: 40.7306, longitude: -73.9867, type: "coffee" },
      { name: "Tasty Bites", latitude: 40.758, longitude: -73.9855, type: "restaurant" }
    ];

    for (const business of businesses) {
      const newBusiness = businessRepository.create(business);
      await businessRepository.save(newBusiness);
    }

    console.log("Seed data added!");
    connection.close();
  })
  .catch((error) => console.error("Failed to seed data:", error));