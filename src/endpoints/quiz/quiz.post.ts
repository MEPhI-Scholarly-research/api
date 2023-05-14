import { Request, Response } from "express"
import { Quiz } from '@/models'
import * as db from '@/db'

// json array serial: https://www.rfc-editor.org/rfc/rfc7159.txt

interface QuizPostRequest extends Request {
  body: {
    quiz: Quiz
  }
}

export async function quizPost(req: QuizPostRequest, res: Response) {
  let body = req.body.quiz ?? null
  if (body == null)
    return res.status(400).json({})

  // create database response
  let client = db.Postgres.client()
  await client.connect()

  // insert quiz with initializing all questions
  let user = req.header("user")
  if (user == undefined) {
    return res.status(400).end()
  }

  const result = await client.query(
    db.Postgres.get("quiz/insert_quiz")!, 
    [user, body.type, body.title, body.description, body.time_limit])
  let quiz_uuid = result.rows[0]['uuid']

  for (const question of body.questions) {
    const result = await client.query(
      db.Postgres.get("quiz/insert_question")!, 
      [quiz_uuid, question.type, question.serial, question.title, question.description])
    let question_uuid = result.rows[0]['uuid']

    for (const answer_option of question.options) {
      const result = await client.query(
        db.Postgres.get("quiz/insert_answer_option")!, 
        [question_uuid, answer_option.title, answer_option.serial])
      let answer_option_uuid = result.rows[0]['uuid']
    }
  }

  await client.end()

  res.status(200).json({
    quiz: quiz_uuid
  })
}