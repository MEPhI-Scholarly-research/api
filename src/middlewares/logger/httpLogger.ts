import { Request, NextFunction, Response } from "express";
import { logger } from "@/app/logger";

export const expressLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`HTTP ${req.method}: ${req.path}`);
  next();
};
