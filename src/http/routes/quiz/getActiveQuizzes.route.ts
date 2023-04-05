import { Request, Response } from "express";

export const getActiveQuizzesRoute = (req: Request, res: Response) => {
  res.json({
    data: [
      {
        id: "wqZbog2Ys-p5nHrNAAAB",
        active: true,
        title: "Quiz n1",
      },
    ],
  });
};
