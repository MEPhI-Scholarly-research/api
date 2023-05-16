import * as db from '@/db'
import { logger } from '@/logger'
import { checkSessionJWT } from '@/crypto'
import { QuizRecord } from '@/models'


export async function connectionEvent(token: string): Promise<[string, QuizRecord]> {
  let [session_uuid, record] = await checkSessionJWT(token)
  if (session_uuid == '') {
    logger.debug('bad jwt')
    return [session_uuid, record]
  }

  return [session_uuid, record]
}