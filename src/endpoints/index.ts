import type { Express } from "express";

import { quizPost, quizGet, quizStartGet } from "./quiz";
import { routes } from "./routes";
import { loginPatch, registerPost } from "./user";
import { loggerMiddleware, authMiddleware } from "@/middlewares";
import { errorMiddleware } from "@/middlewares/error";


const routesIIFE = (app: Express) => {
  app.use(loggerMiddleware)
  app.post(routes.quiz.quizPost, errorMiddleware, authMiddleware, quizPost);
  app.get(routes.quiz.quizGet, errorMiddleware, authMiddleware, quizGet);
  app.get(routes.quiz.quizStartGet, errorMiddleware, authMiddleware, quizStartGet);
  
  app.post(routes.user.register, errorMiddleware, registerPost);
  app.patch(routes.user.login, errorMiddleware, loginPatch);
};

export default routesIIFE;
