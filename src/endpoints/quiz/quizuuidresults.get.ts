import * as db from '@/db';
import { logger } from '@/logger';
import { QuizSessions } from '@/models'

import { Request, Response } from 'express';



export async function quizUuidResultsGet(req: Request, res: Response) {
  let sessions: QuizSessions | undefined = new QuizSessions

  let limit: number = +(req.query.limit as string)
  let offset: number = +(req.query.offset as string)

  let postgres_client = db.Postgres.client()
  await postgres_client.connect()
  sessions = await sessions.select(postgres_client, req.params.uuid, limit, offset)
  if (sessions == undefined) {
    res.status(404).end()
    return
  }
  await postgres_client.end()

  res.status(200).json(sessions)
}