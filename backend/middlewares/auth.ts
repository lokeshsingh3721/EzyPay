import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY: Secret = "NO_SECRET_KEY";

import { Request, Response, NextFunction } from "express";

function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.json({
        success: false,
        message: "token is not provided",
      });
    }

    const payload = jwt.verify(token.split(" ")[1], SECRET_KEY) as JwtPayload;

    if (!payload) {
      return res.json({
        success: false,
        message: "invalid token",
      });
    }
    req.headers["userId"] = payload.userId;

    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.json({
        success: false,
        error: error.message,
      });
    }
  }
}

export = auth;
