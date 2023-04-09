import type { Express } from "express";

import { getActiveQuizzesRoute } from "./quiz";
import { quizPost, quizGet } from "./quiz";
import { routes } from "./routes";
import * as wr from "../wrappers";
import { loginPatch, registerPost } from "./user";


const routesIIFE = (app: Express) => {
  app.get(routes.quiz.getActiveQuizzes, wr.error(getActiveQuizzesRoute));
  app.post(routes.quiz.quiz, wr.error(quizPost));
  app.get(routes.quiz.quiz, wr.error(quizGet));
  app.post(routes.user.register, wr.error(registerPost));
  app.patch(routes.user.login, wr.error(loginPatch));
};

export default routesIIFE;
