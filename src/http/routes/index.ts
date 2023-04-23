import type { Express } from "express";

import { getActiveQuizzesRoute, getSessionTokenRoute } from "./quiz";
import { routes } from "./routes";

const routesIIFE = (app: Express) => {
  app.get(routes.quiz.getActiveQuizzes, getActiveQuizzesRoute);
  app.get(routes.quiz.getSessionToken, getSessionTokenRoute);
};

export default routesIIFE;
