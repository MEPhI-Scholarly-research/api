import * as socketio from "socket.io"
import { QuizRecord, QuizAnswer } from '@/models'

import { logger } from '@/logger'

import { connectionEvent } from './connection'
import { timeEventSender } from './time'
import { deleteAnswerEvent } from './deleteanswer'
import { answerEvent } from './answer'

export async function quizProcess(socket: any) {
  let session_uuid: string
  let record: QuizRecord

  logger.debug('A new WebSocket connection was established');

  socket.on('message', async (message: string) => {
    const body = JSON.parse(message as string);
    if (body['type'] == "connection") {
      [session_uuid, record] = await connectionEvent(body['token'])
      if (session_uuid != '')
        timeEventSender(socket, record.start, record.time_limit)
      logger.debug('quiz_session_'+session_uuid)
    } else if (body['type'] == "answer") {
      record = await answerEvent(session_uuid, record, body['question'], body['answer'])
    } else if (body['type'] == "delete-answer") {
      record = await deleteAnswerEvent(session_uuid, record, body['question'], body['answer'])
    } else if (body['type'] == "finish") {
      
    } else {
      console.log('New message')
    }
  });

  socket.on('close', () => {
    console.log(`Web-Socket connection with uuid '${session_uuid}' closed`);
  });
}