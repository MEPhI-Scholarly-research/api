import * as socketio from "socket.io";
import { QuizRecord } from '@/models';

import { connectionEvent } from './connection'

export async function quizProcess(socket: any) {
  let session_uuid: string
  let record: QuizRecord

  console.log('A new WebSocket connection was established');

  socket.on('message', async (message: string) => {
    const body = JSON.parse(message as string);
    if (body['type'] == "connection") {
      [session_uuid, record] = await connectionEvent(body['token'])
      if (session_uuid != '')
        console.log(record)
    } else {
      console.log('New message')
    }
  });

  socket.on('close', () => {
    console.log(`Web-Socket connection with uuid '${session_uuid}' closed`);
  });
}