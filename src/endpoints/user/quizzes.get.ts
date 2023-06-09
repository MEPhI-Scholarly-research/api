import * as db from '@/database';
import { logger } from '@/logger';
import { QuizMin } from '@/models'

import { Request, Response } from 'express';



export async function quizzesGet(req: Request, res: Response) {
  let quizzes: QuizMin[] = [];

  // get params from request
  let user_uuid = req.header("user");
  if (user_uuid == undefined)
    return res.status(400).end();
  
  let limit: number = +(req.query.limit as string);
  let offset: number = +(req.query.offset as string);

  let postgres_client = db.Postgres.client()
  await postgres_client.connect(); {
    try {
      let quizzes_dbres = await postgres_client.query(db.Postgres.get("quiz/select_user_quizzes")!, [user_uuid, limit, offset]);
      for (let row of quizzes_dbres.rows) {
        let quiz: QuizMin = new QuizMin
        quiz.uuid = row['uuid']
        quiz.owner = row['owner']
        quiz.type = row['type']
        quiz.title = row['title']
        quiz.description = row['description']
        quiz.time_limit = row['time_limit']
        quizzes.push(quiz)
      }
    } catch(e: any) {
      logger.debug('postgres error');
      logger.debug(e);
    }
  } await postgres_client.end();

  res.status(200).json({
    quizzes: quizzes
  });
}