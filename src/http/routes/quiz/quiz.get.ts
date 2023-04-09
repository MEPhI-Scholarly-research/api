import * as db from '../../../app/db';
import { JWT_KEY_SIZE } from "../../../constants"
import { checkAuthJWT } from "../../../app/crypto"

import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';
import * as CryptoJS from 'crypto-js';

// json array serial: https://www.rfc-editor.org/rfc/rfc7159.txt

interface Quiz {
  title: string;
  owner: string;
  answer_options: any;
}

export async function quizGet(req: Request, res: Response) {
  let user = await checkAuthJWT(req.header('token')!)
  if (user == '')
    return res.status(401).json({});

  let quiz: Quiz = {
    title: '',
    owner: '',
    answer_options: null
  };

  let postgresClient = db.Postgres.client();
  await postgresClient.connect(); {
    const result = await postgresClient.query(db.Postgres.get("select_quiz")!, [req.header('uuid')!]);
    if (result.rows[0]['title'] == null)
      return res.status(404).json({});
    var row = result.rows[0]
    quiz.title = row['title'] as string
    quiz.owner = row['owner'] as string
    quiz.answer_options = JSON.parse(row['answer_options'] as string);
  } await postgresClient.end();

  let token_uuid = uuidv4();
  var salt = CryptoJS.lib.WordArray.random(JWT_KEY_SIZE).toString();
  // save in redis
  let redisClient = db.Redis.client();
  await redisClient.connect();
  await redisClient.set('session_'+token_uuid, salt);
  await redisClient.disconnect();
  // create response
  let token = jwt.sign({ "uuid": token_uuid }, salt);
  res.status(200).json({
    token: token,
    quiz: quiz
  });
}