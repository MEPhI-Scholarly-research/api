import { logger } from "@/logger";
import * as db from "@/database";

import { User } from "./user";


export class QuizMin {
  uuid: string = "";
  owner: User = new User;
  type: number = 0;
  title: string = "";
  description: string = "";
  time_limit: number = 0;

  public constructor(init?:Partial<QuizMin>) {
    Object.assign(this, init);
  }

  async select(quiz_uuid: string): Promise<QuizMin | undefined> {
    let owner_uuid = ""

    // select quiz meta
    let db_client = db.Postgres.client();
    await db_client.connect(); {
      try {
        let quiz_dbres = await db_client.query(db.Postgres.get("quiz/select_quiz")!, [quiz_uuid])
        if (quiz_dbres.rows[0] == undefined)
          return undefined;
        this.uuid = quiz_uuid
        owner_uuid =  quiz_dbres.rows[0]["owner"]
        this.type =  quiz_dbres.rows[0]["type"]
        this.title =  quiz_dbres.rows[0]["title"]
        this.description =  quiz_dbres.rows[0]["description"]
        this.time_limit =  quiz_dbres.rows[0]["time_limit"]
      } catch(e: any) {
        logger.debug(e);
        return undefined;
      }
    } await db_client.end();

    // select user
    await this.owner.select(owner_uuid);
    this.owner.username = undefined;
    this.owner.passhash = undefined;

    return this;
  }
}