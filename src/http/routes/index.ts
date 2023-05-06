import type { Express } from "express";

import { getActiveQuizzesRoute, getSessionTokenRoute } from "./quiz";
import { getAccessTokenRoute } from "./user";
import { routes } from "./routes";

const routesIIFE = (app: Express) => {
  // quiz
  app.get(routes.quiz.getActiveQuizzes.path, getActiveQuizzesRoute);
  app.get(routes.quiz.getSessionToken.path, getSessionTokenRoute);

  // user
  app.post(routes.user.getAccessToken.path, getAccessTokenRoute);
};

export default routesIIFE;
