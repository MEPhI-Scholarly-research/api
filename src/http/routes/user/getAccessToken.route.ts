import { Request, Response } from "express";
import { UserInput } from "@/types";
import jwt from "jsonwebtoken";

export const getAccessTokenRoute = (
  req: Request<unknown, unknown, UserInput>,
  res: Response
) => {
  const { login, password } = req.body;

  // проверка логина и пароля из бд
  if (!login || !password) {
    res.status(400).send({
      message: "Login and password is required!",
    });
    return;
  }

  const payload = {
    login,
    displayName: "Default user",
  };

  const accessToken = jwt.sign(payload, "secret");

  res.json({ accessToken, payload });
};
