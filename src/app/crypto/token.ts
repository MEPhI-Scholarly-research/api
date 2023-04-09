import * as db from '../db';
import * as jwt from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';

export async function checkAuthJWT(token: string): Promise<string> {
  var temp = token.substring(token.indexOf('.') + 1);
  var bodybase64 = temp.substring(0, temp.indexOf('.'))
  let body = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(bodybase64)))

  let salt: string

  let client = db.Postgres.client();
  await client.connect();
  try {
    const result = await client.query(db.Postgres.get("select_token")!, 
      [body.uuid]);
      if (result.rowCount == 0)
        return '';
        salt = result.rows[0]['salt']
  } catch(e) {
    return ''
  }
  await client.end()

  return jwt.verify(token, salt) ? body.user : ''
}

export async function checkSessionJWT(token: string): Promise<string> {
  var temp = token.substring(token.indexOf('.') + 1);
  var bodybase64 = temp.substring(0, temp.indexOf('.'))
  let body = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(bodybase64)))

  let salt: string

  let client = db.Redis.client();
  await client.connect();
  try {
    salt = await client.get('session_'+body.uuid) as string;
  } catch(e) {
    return ''
  }
  await client.disconnect()

  return jwt.verify(token, salt) ? body.user : ''
}