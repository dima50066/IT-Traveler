import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../utils/env";

const JWT_SECRET = env("JWT_SECRET");

export const authenticate: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn(" [auth] Missing or invalid Authorization header");
    res
      .status(401)
      .json({ message: "Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded as any;
    next();
  } catch (err: any) {
    console.error(" [auth] Token verification failed:", err.message || err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
