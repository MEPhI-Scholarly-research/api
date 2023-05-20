import * as db from '@/db'
import { logger } from '@/logger'
import { checkSessionJWT } from '@/crypto'
import { QuizRecord, QuizAnswer } from '@/models'

export async function deleteAnswerEvent(session_uuid: string, record: QuizRecord, question: string, answer: string): Promise<QuizRecord> {
  let found_answer = false
  
  for (let i=0; i<record.answers.length; i++) {
    if (record.answers[i].question == question) {
      for (let j=0; j<record.answers[i].answers.length; j++) {
        if (record.answers[i].answers[j] == answer) {
          found_answer = true
          record.answers[i].answers.splice(j, 1)
          break
        }
      }
      break
    }
  }

  if (!found_answer)
    return record

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