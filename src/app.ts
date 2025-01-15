import express from "express";
import discoveryRoute from "./routes/discovery";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api", discoveryRoute);

export default app;
