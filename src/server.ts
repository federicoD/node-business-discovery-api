import "reflect-metadata";
import { AppDataSource } from "./database/dataSource";
import app from "./app";

const PORT = process.env.PORT || 4321;

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to the database!");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });