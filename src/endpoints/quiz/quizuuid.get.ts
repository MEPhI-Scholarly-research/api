import * as db from '@/db'
import { logger } from '@/logger'
import { QuizMin } from '@/models'

import { Request, Response } from "express"

// json array serial: https://www.rfc-editor.org/rfc/rfc7159.txt

export async function quizUuidGet(req: Request, res: Response) {
  let quiz: QuizMin | undefined = new QuizMin

  let client = db.Postgres.client()
  await client.connect(); {
    try {
      quiz = await quiz.select(client, req.params.uuid)
      if (quiz == undefined) {
        res.status(404).end()
        return
      }
    } catch(e: any) {
      logger.debug('redis error')
      logger.debug(e)
    }
  } await client.end()
  // create response
  res.status(200).json({
    quiz: quiz
  })
}