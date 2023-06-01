import * as db from '@/db';
import { logger } from '@/logger';
import { QuizSession } from '@/models'

import { Request, Response } from 'express';



export async function quizSessionUuidGet(req: Request, res: Response) {
  // results for certain user
  let quizSession: QuizSession | undefined = new QuizSession;

  let postgres_client = db.Postgres.client();
  await postgres_client.connect(); {
    try {
      quizSession = await quizSession.select(postgres_client, req.params.uuid);
      if (quizSession == undefined) {
        res.status(404).end();
        return;
      }
    } catch(e: any) {
      logger.debug('redis error');
      logger.debug(e);
    }
  } await postgres_client.end();

  res.status(200).json({
    session: quizSession
  });
}