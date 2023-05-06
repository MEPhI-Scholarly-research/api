import { routes } from "@/http/routes/routes";
import { Request, NextFunction, Response } from "express";

type Route = {
  path: string;
  needAuth: boolean;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authRoutes = Object.values(routes).reduce(
    (prev: Route[], curr) => [...prev, ...Object.values(curr).map((f) => f)],
    []
  );
  const needAuth =
    authRoutes.find((route) => route.path === req.path)?.needAuth || false;

  // проверка на наличие токена авторизации (пока что только наличие)
  if (!req.headers.token && needAuth) {
    return res.status(401).send({
      message: "Authorization is failed",
    });
  }

  next();
};
