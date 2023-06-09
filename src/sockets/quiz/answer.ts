import * as db from '@/database'
import { logger } from '@/logger'
import { checkSessionJWT } from '@/crypto'
import { QuizRecord, QuizAnswer } from '@/models'

export async function answerEvent(session_uuid: string, record: QuizRecord, question: string, answer: string): Promise<QuizRecord> {
  let found_question: boolean = false

  for (let i=0; i<record.answers.length; i++) {
    if (record.answers[i].question == question) {
      found_question = true
      let found_answer: boolean = false
      for (let j=0; j<record.answers[i].answers.length; j++) {
        if (record.answers[i].answers[j] == answer) {
          found_answer = true
          return record
        }
        break
      }

      if (!found_answer)
        record.answers[i].answers.push(answer)
      break
    }
  }
  
  if (!found_question) {
    let answerRecord = new QuizAnswer
    answerRecord.question = question
    answerRecord.answers.push(answer)
    record.answers.push(answerRecord)
  }

  let redis_client = db.Redis.client()
  await redis_client.connect()
  try {
    await redis_client.set('quiz_session_'+session_uuid, JSON.stringify(record))
  } catch(e) {
    logger.debug('redis error')
  }
  await redis_client.disconnect()

  return record
}