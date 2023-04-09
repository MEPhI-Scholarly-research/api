import * as db from '../db';
import * as jwt from 'jsonwebtoken';

export async function checkAuthJWT(token: string): Promise<string> {
  let data = jwt.decode(token, {"complete": true}) as jwt.JwtPayload
  let salt: string

  let client = db.Postgres.client();
  await client.connect();
  try {
    const result = await client.query(db.Postgres.get("select_token")!, 
      [data.uuid]);
      if (result.rowCount == 0)
        return '';
        salt = result.rows[0]['salt']
  } catch(e) {
    return ''
  }
  await client.end()

  return jwt.verify(token, salt) ? data.user : ''
}

export async function checkSessionJWT(token: string): Promise<string> {
  let data = jwt.decode(token, {"complete": true}) as jwt.JwtPayload
  let salt: string

  let client = db.Redis.client();
  await client.connect();
  try {
    salt = await client.get('session_'+data.uuid) as string;
  } catch(e) {
    return ''
  }
  await client.disconnect()

  return jwt.verify(token, salt) ? data.user : ''
}