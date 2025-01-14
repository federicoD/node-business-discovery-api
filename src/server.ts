import app from "./app";
import dotenv from "dotenv";
import "reflect-metadata";
import { createConnection } from "typeorm";


dotenv.config();

const PORT = process.env.PORT || 4321;

createConnection()
  .then(() => {
    console.log("Connected to the database!");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log("Database connection failed:", error));