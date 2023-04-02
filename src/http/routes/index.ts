import type { Express } from "express";

import { getActiveQuizzesRoute } from "./quiz";
import { routes } from "./routes";

const routesIIFE = (app: Express) => {
  app.get(routes.quiz.getActiveQuizzes, getActiveQuizzesRoute);
};

export default routesIIFE;
