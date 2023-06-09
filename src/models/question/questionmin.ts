import * as db from "@/database";
import { logger } from "@/logger";

import { AbstractQuestion } from "./abstractquestion";

export class QuestionMin extends AbstractQuestion {
  public constructor(init?:Partial<QuestionMin>) {
    super();
    Object.assign(this, init);
  }

  async select(uuid: string): Promise<QuestionMin | undefined> {
    let db_client = db.Postgres.client();
    await db_client.connect(); {
      let question_dbres = await db_client.query(db.Postgres.get("quiz/select_question")!, [uuid]);
      if (question_dbres.rows[0] == undefined)
        return undefined;
        
      this.uuid = question_dbres.rows[0]["uuid"]
      this.quiz = question_dbres.rows[0]["quiz"]
      this.title = question_dbres.rows[0]["title"]
      this.type = question_dbres.rows[0]["type"]
      this.description = question_dbres.rows[0]["description"]
      this.serial = question_dbres.rows[0]["serial"]
    } db_client.end();

    return this;
  }
}