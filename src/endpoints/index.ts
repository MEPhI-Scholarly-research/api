import type { Express } from "express";

import { quizPost, quizUuidGet, quizUuidStartGet, quizUuidSessionsGet, quizSessionUuidGet } from "./quiz";
import { loginPost, quizzesGet, registerPost } from "./user";
import { loggerMiddleware, authMiddleware } from "@/middlewares";
import { errorMiddleware } from "@/middlewares/error";

const basePath = "/api/v1";

const routesIIFE = (app: Express) => {
  app.use(loggerMiddleware)

  // quiz
  app.post(basePath+"/quiz/", errorMiddleware, authMiddleware, quizPost);
  app.get(basePath+"/quiz/:uuid", errorMiddleware, authMiddleware, quizUuidGet);
  app.patch(basePath+"/quiz/:uuid/start", errorMiddleware, authMiddleware, quizUuidStartGet);
  app.get(basePath+"/quiz/:uuid/results", errorMiddleware, quizUuidSessionsGet)
  app.get(basePath+"/quiz/session/:uuid", errorMiddleware, quizSessionUuidGet)

  // user
  app.post(basePath+"/register", errorMiddleware, registerPost);
  app.post(basePath+"/login", errorMiddleware, loginPost);
  app.get(basePath+"/quizzes", errorMiddleware, authMiddleware, quizzesGet);
};

export default routesIIFE;
