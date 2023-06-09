import { logger } from "@/logger";
import * as db from "@/database";

import { QuestionMin } from "./question/questionmin";
import { AbstractQuestion } from "./question/abstractquestion"
import { QuestionWithOptions } from "./question/questionwithoptions";
import { QuizMin } from "./quizmin";


export class Quiz extends QuizMin {
  questions: AbstractQuestion[] = []

  public constructor(init?:Partial<Quiz>) {
    super()
    Object.assign(this, init);
  }

  override async select(quiz_uuid: string): Promise<Quiz | undefined> {
    let owner_uuid = "";

    let db_client = db.Postgres.client();
    await db_client.connect(); {
      try {
        // select quiz meta
        let quiz_dbres = await db_client.query(db.Postgres.get("quiz/select_quiz")!, [quiz_uuid])
        if (quiz_dbres.rows[0] == undefined)
          return undefined;
        
        this.uuid = quiz_uuid
        owner_uuid = quiz_dbres.rows[0]["owner"]
        this.type = quiz_dbres.rows[0]["type"]
        this.title = quiz_dbres.rows[0]["title"]
        this.description = quiz_dbres.rows[0]["description"]
        this.time_limit = quiz_dbres.rows[0]["time_limit"]

        // select quiz questions
        let result_questions = await db_client.query(db.Postgres.get("quiz/select_questions")!, [quiz_uuid])
        if (result_questions.rows[0] == undefined)
          return undefined;

        for (const row_question of result_questions.rows) {
          let question: QuestionMin | undefined = new QuestionMin({
            uuid: row_question["uuid"],
            quiz: row_question["quiz"],
            type: row_question["type"],
            title: row_question["title"],
            description: row_question["description"],
            serial: row_question["serial"]
          });

          this.questions.push(question);
        }
      } catch(e: any) {
        logger.debug(e);
        return undefined;
      }
    } await db_client.end();

    for (let i in this.questions) {
      let certain: AbstractQuestion | undefined;
      if (this.questions[i].type == 1)
        certain = new QuestionWithOptions;
      else
        certain = new QuestionMin

      certain = await certain.select(this.questions[i].uuid);
      if (certain == undefined)
        return undefined;
      this.questions[i] = certain!;
    }

    // select user
    await this.owner.select(owner_uuid);
    this.owner.username = undefined;
    this.owner.passhash = undefined;

    return this
  }
}