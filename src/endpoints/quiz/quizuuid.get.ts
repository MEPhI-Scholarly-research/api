import { QuizMin } from '@/models'

import { Request, Response } from "express"

// json array serial: https://www.rfc-editor.org/rfc/rfc7159.txt

export async function quizUuidGet(req: Request, res: Response) {
  let quiz: QuizMin | undefined = new QuizMin

  quiz = await quiz.select(req.params.uuid)
  if (quiz == undefined) {
    res.status(404).end()
    return
  }
  
  // create response
  res.status(200).json({
    quiz: quiz
  })
}