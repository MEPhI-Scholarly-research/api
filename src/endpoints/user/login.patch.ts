import * as db from '@/db';
import * as crypto from '@/crypto';
import { JWT_KEY_SIZE } from "@/constants"

import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';

// json array serial: https://www.rfc-editor.org/rfc/rfc7159.txt

interface User extends Request {
  body: {
    username: string
    password: string
  }
}

interface PasswordMeta {
  iterations: number
  salt: string
  hash: string
}

export async function loginPatch(req: User, res: Response) {
  var body = req.body ?? null;
  if (body == null)
    return res.status(400).json({});

  let user: string
  let pm: PasswordMeta = {iterations: 0,salt:'',hash:''}

  // get user data from postgres
  let client = db.Postgres.client();
  await client.connect();
  try {
    const result = await client.query( db.Postgres.get("user/select_user")!, 
      [body.username]);
    if (result.rowCount == 0)
      return res.status(400).json({});
      user = result.rows[0]['uuid']
    var passhash = result.rows[0]['passhash']
    pm.iterations = +passhash.substring(0,passhash.indexOf(':'))
    passhash = passhash.substring(passhash.indexOf(':')+1)
    pm.salt = passhash.substring(0,passhash.indexOf(':'))
    pm.hash = passhash.substring(passhash.indexOf(':')+1)
  } catch(e) {
    return res.status(401).json({})
  }
  await client.end()

  // check password
  if (!crypto.Password.check(body.password, pm.salt, pm.iterations, pm.hash))
    return res.status(400).json({});

  // create jwt
  var token_uuid: string
  var secret_key = CryptoJS.lib.WordArray.random(JWT_KEY_SIZE).toString();
  // save jwt key in postgres
  client = db.Postgres.client();
  await client.connect();
  try {
    const result = await client.query( db.Postgres.get("user/insert_token")!, [secret_key]);
    token_uuid = result.rows[0]['uuid']
  } catch(e) {
    console.log(e)
    return res.status(500).json({})
  }
  await client.end()

  let token = jwt.sign({"uuid": token_uuid, "user": user}, secret_key);
  res.status(200).json({
    token: token
  });
}