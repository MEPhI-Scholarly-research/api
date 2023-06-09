import * as db from '@/database';
import { logger } from '@/logger';
import { QuizSession } from '@/models'

import { Request, Response } from 'express';



export async function quizSessionUuidGet(req: Request, res: Response) {
  // results for certain user
  let quizSession: QuizSession | undefined = new QuizSession;

  quizSession = await quizSession.select(req.params.uuid);

  res.status(200).json({
    session: quizSession
  });
}