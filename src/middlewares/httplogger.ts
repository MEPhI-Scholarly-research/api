import { Request, NextFunction, Response } from "express";
import { logger } from "@/logger";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`HTTP ${req.method}: ${req.path}`);
  next();
};
