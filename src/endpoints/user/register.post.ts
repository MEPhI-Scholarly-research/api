import * as db from '@/database';

import * as crypto from '@/crypto';
import { Request, Response } from "express";
import * as CryptoJS from 'crypto-js';

// json array serial: https://www.rfc-editor.org/rfc/rfc7159.txt

interface User extends Request {
  body: {
    displayname: string
    username: string
    password: string
  }
}

export async function registerPost(req: User, res: Response) {
  var body = req.body ?? null;
  if (body == null)
    return res.status(400).json({});

  var salt = CryptoJS.lib.WordArray.random(16).toString();
  var iterations = Math.round(Math.random()*100) + 1000;
  var passhash = crypto.Password.hash(body.password, salt, iterations)
  
  var uuid: string

  let client = db.Postgres.client();
  await client.connect();
  try {
    const result = await client.query(db.Postgres.get("user/insert_user")!, 
      [body.username, body.displayname, iterations.toString() + ':' + salt + ':' + passhash]);
    uuid = result.rows[0]['uuid']
  } catch(e) {
    return res.status(400).json({});
  }
  await client.end()

  res.status(200).json({
    uuid: uuid
  });
}