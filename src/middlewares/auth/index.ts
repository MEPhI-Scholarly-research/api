import { Request, NextFunction, Response } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // проверка на наличие токена авторизации (пока что только наличие)
  if (!req.headers.token) {
    return res.status(401).send({
      message: "Authorization is failed",
    });
  }

  next();
};
