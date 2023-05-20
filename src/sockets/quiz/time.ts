import * as db from '@/db'
import { logger } from '@/logger'
import { checkSessionJWT } from '@/crypto'
import { QuizRecord } from '@/models'

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

// sends time message on socket every 1 second
export async function timeEventSender(socket: any, start: number, duration: number) {
  while (start + duration - Date.now() > 0) {
    socket.emit("message", `{"type":"time","left":${start + duration - Date.now()}}"}`);
    await delay(1000)
  }
}