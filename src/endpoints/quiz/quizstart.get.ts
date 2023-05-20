import * as db from '@/db';
import * as log from '@/logger';
import { Quiz, Question, Option, QuizRecord } from '@/models'

import { JWT_KEY_SIZE } from '@/constants';

import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';
import * as CryptoJS from 'crypto-js';

async function selectFullQuiz(quiz_uuid: string): Promise<Quiz | undefined> {
  let quiz: Quiz = new Quiz()

  let postgres_client = db.Postgres.client();
  postgres_client.connect();

  // select quiz meta
  let result_quiz = await postgres_client.query(db.Postgres.get('quiz/select_quiz')!, [quiz_uuid])
  if (result_quiz.rows[0] == undefined) {
    log.logger.debug('undefined result_quiz');
    return undefined;
  }
  var row_quiz = result_quiz.rows[0]

  quiz.uuid = quiz_uuid
  quiz.owner = row_quiz['owner']
  quiz.type = row_quiz['type']
  quiz.title = row_quiz['title']
  quiz.description = row_quiz['description']
  quiz.time_limit = row_quiz['time_limit']

  // select quiz questions
  let result_questions = await postgres_client.query(db.Postgres.get('quiz/select_questions')!, [quiz_uuid])
  if (result_questions.rows[0] == undefined) {
    log.logger.debug('undefined result_questions');
    return undefined;
  }

  for (const row_question of result_questions.rows) {
    let question: Question = new Question()
    
    question.uuid = row_question['uuid']
    question.type = row_question['type']
    question.title = row_question['title']
    question.description = row_question['description']
    question.serial = row_question['serial']

    let result_options = await postgres_client.query(db.Postgres.get('quiz/select_options')!, [question.uuid])
    if (result_options.rows[0] == undefined) {
      log.logger.debug('undefined result_options');
      return undefined;
    }

    for (const row_option of result_options.rows) {
      let option: Option = new Option()

      option.uuid = row_option['uuid']
      option.title = row_option['title']
      option.serial = row_option['serial']

      question.options.push(option)
    }

    quiz.questions.push(question)
  }

  return quiz
}

export async function quizStartGet(req: Request, res: Response) {
  // get params from request
  let user_uuid = req.header("user");
  if (user_uuid == undefined)
    return res.status(400).end();
  let quiz_uuid = req.params['uuid'];

  // init main variables
  let quizRecord: QuizRecord = new QuizRecord()
  let quiz: Quiz | undefined = await selectFullQuiz(quiz_uuid)
  if (quiz == undefined)
    return res.status(404).end();
  
  let redis_client = db.Redis.client();
  await redis_client.connect();

  // check in redis session existence
  let quiz_x_user_redis_key = "quiz_x_user_"+user_uuid+"_"+quiz_uuid;
  let session_uuid: string | undefined = await redis_client.get(quiz_x_user_redis_key) as string | undefined;

  if (session_uuid == undefined) {
    // create new session
    session_uuid = uuidv4();
    // get quiz from postgres
    quiz = await selectFullQuiz(quiz_uuid)
    if (quiz == undefined)
      return res.status(404).end();
    // create new session
    await redis_client.set(quiz_x_user_redis_key, session_uuid);

    quizRecord.quiz = quiz_uuid;
    quizRecord.user = user_uuid;
    quizRecord.start = Date.now();
    quizRecord.time_limit = quiz.time_limit;
    quizRecord.answers = [];

    // insert in postgres that session was started
    let postgres_client = db.Postgres.client();
    postgres_client.connect();
    postgres_client.query(db.Postgres.get('quiz/start_quiz')!, [user_uuid, quiz_uuid, Date.now()]);
  } else {
    // session already exists
    let quizRecordJsonStr = await redis_client.get("quiz_session_"+session_uuid) as string | undefined;
    if (quizRecordJsonStr == undefined) {
      log.logger.error('cannot get quiz session by uuid')
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
    quiz: quiz,
    token: token,
    answers: quizRecord.answers,
  });
}