import express from "express";
import discoveryRoute from "./routes/discovery";
import helmet from "helmet";
import logger from "./utils/logger";
import morgan from "morgan";

const app = express();

app.use(helmet());
app.use(express.json());

// Use Morgan to capture HTTP requests and log them using Winston
app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );

// Routes
app.use("/api", discoveryRoute);

// Log unhandled routes
app.use((req, res, next) => {
    logger.warn(`Unhandled route: ${req.method} ${req.url}`);
    res.status(404).send("Not found");
});

export default app;
