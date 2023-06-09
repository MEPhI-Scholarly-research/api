import * as db from "@/database";
import * as log from "@/logger";
import * as constants from "@/constants";
import { QuestionWithOptions, QuizSession, QuizRecord, TextOption } from "@/models"

import { JWT_KEY_SIZE } from "@/constants";

import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";
import * as CryptoJS from "crypto-js";

async function selectSession(session: QuizSession, session_uuid: string): Promise<QuizSession | undefined> {
  let ok = await session.select(session_uuid);
  if (ok == undefined)
    return undefined;
  
  // clear all data about results
  session.score = undefined;
  for (let question of session.quiz.questions) {
    if (question.type = constants.QUESTION_WITH_TEXT_OPTIONS) {
      for (let option of (question as QuestionWithOptions).options)
        (option as TextOption).is_correct = undefined;
    }
  }

  return session;
}

export async function quizUuidStartGet(req: Request, res: Response) {
  // get params from request
  let user_uuid = req.header("user");
  if (user_uuid == undefined)
    return res.status(400).end();
  let quiz_uuid = req.params["uuid"];

  // init main variables
  let quizRecord: QuizRecord = new QuizRecord();
  let session: QuizSession | undefined = new QuizSession;
  
  let redis_client = db.Redis.client();
  await redis_client.connect();

  // check in redis session existence
  let quiz_x_user_redis_key = "quiz_x_user_"+user_uuid+"_"+quiz_uuid;
  let session_uuid: string | undefined = await redis_client.get(quiz_x_user_redis_key) as string | undefined;

  if (session_uuid == undefined) { // create new session
    quizRecord.quiz = quiz_uuid;
    quizRecord.user = user_uuid;
    quizRecord.start = Date.now();
    quizRecord.time_limit = session.quiz.time_limit;
    quizRecord.answers = [];

    // insert in postgres that session was started
    let postgres_client = db.Postgres.client();
    postgres_client.connect(); {
      let res = await postgres_client.query(db.Postgres.get("quiz/session/start_quiz")!, [user_uuid, quiz_uuid, Date.now()]);
      session_uuid = res.rows[0]["uuid"] as string
    } await postgres_client.end();

    session = await selectSession(session, session_uuid);
    if (session == undefined)
      return res.status(404).end();

    // create new session
    await redis_client.set(quiz_x_user_redis_key, session_uuid);
  } else { // session already exists
    session = await selectSession(session, session_uuid);
    if (session == undefined)
      return res.status(404).end();

    let quizRecordJsonStr = await redis_client.get("quiz_session_"+session_uuid) as string | undefined;
    if (quizRecordJsonStr == undefined) {
      log.logger.error("cannot get quiz session by uuid")
      return res.status(500).end();
    }

    quizRecord = JSON.parse(quizRecordJsonStr)
  }

  // gen secret key for token
  let key = CryptoJS.lib.WordArray.random(JWT_KEY_SIZE).toString();
  quizRecord.key = key;
  // save record in redis
  await redis_client.set("quiz_session_"+session_uuid, JSON.stringify(quizRecord));

  // close db connections
  redis_client.disconnect();

  // create response
  let token = jwt.sign({ "session-uuid": session_uuid, "user-uuid": user_uuid }, key);
  res.status(200).json({
    session: session,
    token: token,
  });
}