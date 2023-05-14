import * as db from '@/db'
import * as log from '@/logger'
import { Quiz } from '@/models'

import { Request, Response } from "express"
import { QueryResult } from "pg"

// json array serial: https://www.rfc-editor.org/rfc/rfc7159.txt

export async function quizGet(req: Request, res: Response) {
  let quiz: Quiz = {
    uuid: '',
    owner: '',
    type: 0,
    title: '',
    description: '',
    time_limit: 0,
    questions: []
  }

  let postgresClient = db.Postgres.client()
  await postgresClient.connect(); {
    const result = await postgresClient.query(db.Postgres.get("quiz/select_quiz")!, [req.params['uuid']])
    if (result.rows[0] == undefined)
      return res.status(404).json({})
    var row = result.rows[0]
    quiz.uuid = row['uuid'] as string
    quiz.owner = row['owner'] as string
    quiz.type = row['type'] as number
    quiz.title = row['title'] as string
    quiz.description = row['description'] as string
    quiz.time_limit = row['time_limit'] as number
  } await postgresClient.end()
  // create response
  res.status(200).json({
    quiz: quiz
  })
}