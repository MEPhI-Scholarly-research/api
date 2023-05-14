import * as db from '@/db';
import { Quiz } from '@/models'
import { JWT_KEY_SIZE } from '@/constants';

import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';
import * as CryptoJS from 'crypto-js';

export async function quizStartGet(req: Request, res: Response) {
  interface QuizAnswer {
    question: string
    answers: []
  }

  interface QuizRecord {
    quiz: string
    start: number
    end: number
    answers: QuizAnswer[]
  }

  let quiz: Quiz = {
    uuid: '',
    owner: '',
    type: 0,
    title: '',
    description: '',
    time_limit: 0,
    questions: []
  }

  // get params from request
  let user_uuid = req.header("user")
  if (user_uuid == undefined) {
    return res.status(400).end()
  }
  let quiz_uuid = req.params['uuid']
  
  let redis_client = db.Redis.client()
  await redis_client.connect();
  // check in redis session existence
  let quiz_x_user_redis_key = "quiz_x_user_"+user_uuid+"_"+quiz_uuid
  let session_uuid: string | undefined = await redis_client.get(quiz_x_user_redis_key) as string | undefined
  let quizRecordJsonStr: string | undefined
  if (session_uuid == undefined) {
    // create new session
    session_uuid = uuidv4();
    let duration: number = 0 // !!! we must get this from postgres with a lot of data about quiz
    await redis_client.set(quiz_x_user_redis_key, session_uuid)
    let quizRecord: QuizRecord = {
      quiz: quiz_uuid, start: Date.now(), end: Date.now() + duration, answers: []
    }
    quizRecordJsonStr = JSON.stringify(quizRecord);
    await redis_client.set("quiz_session_"+session_uuid, quizRecordJsonStr)
  } else {
    // session already exists
    quizRecordJsonStr = await redis_client.get("quiz_session_"+session_uuid) as string | undefined
    if (quizRecordJsonStr == undefined) {

    }
  }
  

  // generate new session
  let secret_key = CryptoJS.lib.WordArray.random(JWT_KEY_SIZE).toString(); // must be saved in Postgres


  // create response
  let token = jwt.sign({ "session-uuid": session_uuid, "user-uuid": user_uuid }, secret_key);
  res.status(200).json({
    quiz: quiz,
    token: token,
  });
}