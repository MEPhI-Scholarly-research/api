import { Request, Response } from "express"
import { Quiz } from '@/models'
import * as db from '@/db'
import { logger } from '@/logger'

// json array serial: https://www.rfc-editor.org/rfc/rfc7159.txt

interface QuizPostRequest extends Request {
  body: {
    quiz: Quiz
  }
}

export async function quizPost(req: QuizPostRequest, res: Response) {
  let quiz = req.body.quiz ?? null
  if (quiz == null)
    return res.status(400).json({})

  // insert quiz with initializing all questions
  let user = req.header("user")
  if (user == undefined) {
    return res.status(400).end()
  }

  let quiz_uuid: string = ""
  // create database response
  let client = db.Postgres.client()
  await client.connect(); {
    try {
      const result = await client.query(
        db.Postgres.get("quiz/insert_quiz")!, 
        [user, quiz.type, quiz.title, quiz.description, quiz.time_limit])
      quiz_uuid = result.rows[0]['uuid']

      for (const question of quiz.questions) {
        const result = await client.query(
          db.Postgres.get("quiz/insert_question")!, 
          [quiz_uuid, question.type, question.serial, question.title, question.description])
        let question_uuid = result.rows[0]['uuid']

        for (const answer_option of question.options) {
          const result = await client.query(
            db.Postgres.get("quiz/insert_option")!, 
            [question_uuid, answer_option.title, answer_option.serial, answer_option.is_correct])
          let answer_option_uuid = result.rows[0]['uuid']
        }
      }
    } catch(e:any) {
      logger.debug('redis error')
      logger.debug(e)
      res.status(500).end()
    }
  } await client.end()

  res.status(200).json({
    quiz: quiz_uuid
  })
}