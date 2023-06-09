import * as db from '@/database';
import { logger } from '@/logger';
import { QuizSessions } from '@/models'

import { Request, Response } from 'express';



export async function quizUuidSessionsGet(req: Request, res: Response) {
  let sessions: QuizSessions | undefined = new QuizSessions;

  let limit: number = +(req.query.limit as string);
  let offset: number = +(req.query.offset as string);

  sessions = await sessions.select(req.params.uuid, limit, offset);

  res.status(200).json(sessions);
}