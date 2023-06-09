import * as db from "@/database";
import { logger } from "@/logger";

export class User {
  uuid: string = "";
  username: string | undefined = undefined;
  displayname: string = "";
  passhash: string | undefined = undefined;

  public constructor(init?:Partial<User>) {
    Object.assign(this, init);
  }

  async select(user_uuid: string): Promise<User | undefined> {
    let db_client = db.Postgres.client();
    await db_client.connect(); {
      try {
        let user_dbres = await db_client.query(db.Postgres.get("user/select_user_uuid")!, [user_uuid]);
        if (user_dbres.rows[0] == undefined)
          return undefined;
        
        this.uuid = user_dbres.rows[0]["uuid"];
        this.username = user_dbres.rows[0]["username"];
        this.displayname = user_dbres.rows[0]["displayname"];
        this.passhash = user_dbres.rows[0]["passhash"];
      } catch(e: any) {
        logger.debug(e);
        return undefined;
      }
    } await db_client.end();

    return this;
  }
}