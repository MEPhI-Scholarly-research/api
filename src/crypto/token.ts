import * as db from "../database";
import * as jwt from "jsonwebtoken";
import * as CryptoJS from "crypto-js";

import { logger } from "@/logger"

import { QuizRecord } from "@/models"

export async function checkAuthJWT(token: string): Promise<string> {
  var temp = token.substring(token.indexOf(".") + 1);
  var bodybase64 = temp.substring(0, temp.indexOf("."))
  let body = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(bodybase64)))

  let user: string;
  let salt: string;

  let client = db.Postgres.client();
  await client.connect(); {
    try {
      const result = await client.query(db.Postgres.get("user/select_token")!, 
        [body.uuid]);
        if (result.rowCount == 0)
          return "";
        salt = result.rows[0]["salt"];
        user = result.rows[0]["owner"]
    } catch(e) {
      return "";
    }
  } await client.end();

  return jwt.verify(token, salt) ? user : "";
}

export async function checkSessionJWT(token: string): Promise<[string, QuizRecord]> {
  // get jwt payload
  var temp = token.substring(token.indexOf(".") + 1);
  var bodybase64 = temp.substring(0, temp.indexOf("."))
  let body = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(bodybase64)))

  let record: QuizRecord = new QuizRecord()

  let redis_client = db.Redis.client();
  await redis_client.connect();
  try {
    let dataStr = await redis_client.get("quiz_session_"+body["session-uuid"])
    if (dataStr == undefined) {
      logger.debug("cannot find session record in redis")
      return ["", record]
    }
    record = JSON.parse(dataStr as string)
  } catch(e) {
    logger.debug("redis request error")
    return ["", record]
  }
  await redis_client.disconnect()

  return jwt.verify(token, record.key) ? [body["session-uuid"], record] : ["", record]
}