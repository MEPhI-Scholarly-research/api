import type { Express } from "express";

import { quizPost, quizUuidGet, quizStartUuidGet, quizUuidResultsGet, quizSessionUuidGet } from "./quiz";
import { loginPost, registerPost } from "./user";
import { loggerMiddleware, authMiddleware } from "@/middlewares";
import { errorMiddleware } from "@/middlewares/error";

const basePath = "/api/v1"

const routesIIFE = (app: Express) => {
  app.use(loggerMiddleware)

  // quiz
  app.post(basePath+"/quiz/", errorMiddleware, authMiddleware, quizPost);
  app.get(basePath+"/quiz/:uuid", errorMiddleware, authMiddleware, quizUuidGet);
  app.get(basePath+"/quiz/start/:uuid", errorMiddleware, authMiddleware, quizStartUuidGet);
  app.get(basePath+"/quiz/:uuid/results", errorMiddleware, quizUuidResultsGet)
  app.get(basePath+"/quiz/session/:uuid", errorMiddleware, quizSessionUuidGet)

  // user
  app.post(basePath+"/register", errorMiddleware, registerPost);
  app.post(basePath+"/login", errorMiddleware, loginPost);
};

export default routesIIFE;
