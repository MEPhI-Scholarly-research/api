import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const getSessionTokenRoute = (req: Request, res: Response) => {
  const quizCode = (req.query as { code: string }).code;

  // здесь делаем запрос в бд на получение активных кодом
  switch (quizCode) {
    // Example
    case "active_quiz_code":
      {
        // если квиз с таким кодом нашелся и он активные, то отдаем токен пользователю и сохраняем его в редис
        res.json({ sessionToken: uuidv4() });
      }
      break;
    // Example
    case "inactive_quiz_code":
      {
        res.status(451).send({
          message: `Quiz with code ${quizCode} is inactive`,
        });
      }
      break;
    default: {
      res.status(404).send({
        message: `Quiz with code ${quizCode} is not found`,
      });
    }
  }
};
