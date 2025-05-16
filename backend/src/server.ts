import express from "express";
import pinoHttp from "pino-http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/index";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { UPLOAD_DIR } from "./constants/constants";
import { env } from "./utils/env";

dotenv.config();

const FRONTEND_URL = env("FRONTEND_URL", "http://localhost:5173");

const pinoConfig =
  process.env.NODE_ENV !== "production"
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      }
    : {};

console.log(`Running in ${process.env.NODE_ENV} mode`);

export const setupServer = (): express.Express => {
  const app = express();

  app.use(express.json());

  const corsOptions = {
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(pinoHttp(pinoConfig));

  app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Traveler API" });
  });

  app.use("/uploads", express.static(UPLOAD_DIR));
  app.use(router);

  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  app.use(notFoundHandler);

  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      errorHandler(err, req, res, next);
    }
  );

  return app;
};
