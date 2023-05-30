import * as db from '@/db'
import { logger } from '@/logger'
import { checkSessionJWT } from '@/crypto'
import { QuizRecord, QuizAnswer } from '@/models'

export async function finishEvent(token: string): Promise<boolean> {
  let [session_uuid, record] = await checkSessionJWT(token)
  // prepare answers and questions arrays
  let questions: string[] = []
  let answers: string[] = []

  try {
    if (record.answers != undefined)
      for (let i=0; i<record.answers.length; i++)
        if (record.answers[i].answers != undefined)
          for (let j=0; j<record.answers[i].answers.length; j++) {
            answers.push(record.answers[i].answers[j])
            questions.push(record.answers[i].question)
          }
  } catch (e: any) {
    logger.debug('error in reading record params')
    logger.debug(e)
  }

  // get user uuid from redis
  // and delete redis records
  let redis_client = db.Redis.client()
  await redis_client.connect(); {
    try {
      await redis_client.del('quiz_session_'+session_uuid)
      await redis_client.del('quiz_x_user_'+record.quiz+'_'+record.user)
    } catch(e:any) {
      logger.debug('redis error')
      logger.debug(e)
    }
  } await redis_client.disconnect()

  let postgres_client = db.Postgres.client()
  await postgres_client.connect(); {
    try {
      await postgres_client.query(db.Postgres.get('quiz/session/finish_quiz') as string, 
        [session_uuid, Date.now(), questions, answers])
    } catch(e:any) {
      logger.debug('postgres error')
      logger.debug(e)
    }
  } await postgres_client.end()

  return true
}