import express from "express";
import discoveryRoute from "./routes/discovery";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(express.json());

// Routes
app.use("/api", discoveryRoute);

export default app;
