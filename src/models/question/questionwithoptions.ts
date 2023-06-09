import { Client } from "pg";
import * as db from "@/database";
import { logger } from "@/logger";

import { AbstractQuestion } from "./abstractquestion"; 
import { AbstractOption } from "../option/abstractoption";
import { TextOption } from "../option/textoption";

export class QuestionWithOptions extends AbstractQuestion {
  options: AbstractOption[] = [];

  public constructor(init?:Partial<QuestionWithOptions>) {
    super(init);
    Object.assign(this, init);
  }

  private async selectTextOptions(db_client: Client) {
    let result_options = await db_client.query(db.Postgres.get("quiz/select_options")!, [this.uuid]);
    if (result_options.rows[0] == undefined)
      return undefined;
    
    for (const row_option of result_options.rows) {
      let option: TextOption = new TextOption({
        uuid: row_option["uuid"],
        question: row_option["question"],
        title: row_option["title"],
        serial: row_option["serial"],
        is_correct: row_option["is_correct"]
      });

      this.options.push(option);
    }
  }

  override async select(uuid: string): Promise<QuestionWithOptions | undefined> {
    let db_client = db.Postgres.client();
    await db_client.connect(); {
      let question_dbres = await db_client.query(db.Postgres.get("quiz/select_question")!, [uuid]);
      if (question_dbres.rows[0] == undefined)
        return undefined;
        
      this.uuid = question_dbres.rows[0]["uuid"]
      this.quiz = question_dbres.rows[0]["quiz"]
      this.type = question_dbres.rows[0]["type"]
      this.title = question_dbres.rows[0]["title"]
      this.description = question_dbres.rows[0]["description"]
      this.serial = question_dbres.rows[0]["serial"]
      
      if (this.type == 1)
        await this.selectTextOptions(db_client)
      
    } db_client.end();

    return this;
  }
}
