import { Quiz } from './quiz';
import { QuizMin } from './quizmin';
import { QuestionWithOptions } from './question/questionwithoptions';

import * as db from '@/database';
import { logger } from '@/logger';
import * as constants from '@/constants';
import { TextOption } from './option/textoption';

export class QuizSessionMin {
  uuid: string = "";
  user: string = "";
  start: number = 0;
  finish: number = 0;
  score: number | undefined = undefined;

  public constructor(init?:Partial<QuizSessionMin>) {
    Object.assign(this, init);
  }

  async select(session_uuid: string): Promise<QuizSessionMin | undefined> {
    let full: QuizSession | undefined = new QuizSession;
    full = await full.select(session_uuid);
    if (full == undefined)
      return undefined;

    this.uuid = full.uuid;
    this.user = full.user;
    this.start = full.start;
    this.finish = full.finish;
    this.score = full.score;

    return this
  }
}

// quiz_x_users in database
export class QuizSession extends QuizSessionMin {
  quiz: Quiz = new Quiz;

  public constructor(init?:Partial<QuizSession>) {
    super();
    Object.assign(this, init);
  }

  async select(session_uuid: string): Promise<QuizSession | undefined> {
    let session_dbres: any;
    let answers_dbres: any;
    
    let db_client = db.Postgres.client();
    db_client.connect(); {
      try {
        // get session data
        session_dbres = await db_client.query(db.Postgres.get('quiz/session/select_session') as string, [session_uuid]);
        if (session_dbres.rows[0] == undefined)
          return undefined;
        
        // get user's answers data
        answers_dbres = await db_client.query(db.Postgres.get('quiz/session/select_answers') as string, [session_uuid]);
      } catch(e: any) {
        logger.debug(e);
        return undefined;
      }
    } db_client.end();

    // save session data
    this.uuid = session_uuid;
    this.user = session_dbres.rows[0]['user'];
    this.start = session_dbres.rows[0]['start'];
    this.finish = session_dbres.rows[0]['finish'];

    // save user's answers data
    let answers_map: Map<string, Set<string>> = new Map<string, Set<string>>();
    for (const answer of answers_dbres.rows) {
      if (answers_map.has(answer['question'])) {
        answers_map.set(answer['question'], answers_map.get(answer['question'])?.add(answer['answer'])!);
      } else {
        answers_map.set(answer['question'], new Set<string>);
        answers_map.set(answer['question'], answers_map.get(answer['question'])?.add(answer['answer'])!);
      }
    }

    // get quiz
    let ok = await this.quiz.select(session_dbres.rows[0]['quiz']);
    if (ok == undefined)
      return undefined;
    
    // sum score
    this.score = 0;
    for (let question of this.quiz.questions) {
      let notok: number = 0;
      if (question.type == constants.QUESTION_WITH_TEXT_OPTIONS) {
        for (let option of (question as QuestionWithOptions).options) {
          if (question.type == constants.QUESTION_WITH_TEXT_OPTIONS) {
            if (answers_map.has(question.uuid)) {
              if (answers_map.get(question.uuid)?.has(option.uuid!))
                (option as TextOption).is_selected = true;
            } else {
              (option as TextOption).is_selected = false;
            }
            
            if ((option as TextOption).is_selected != (option as TextOption).is_correct)
              notok++;
          }
        }
      }

      if (notok == 0)
        this.score++;
    }

    return this;
  }
}

export class QuizSessions {
  quiz: QuizMin = new QuizMin;
  sessions: QuizSessionMin[] = []; 

  public constructor(init?:Partial<QuizSessions>) {
    Object.assign(this, init);
  }

  async select(quiz_uuid: string, limit: number, offset: number): Promise<QuizSessions | undefined> {
    let ok = this.quiz.select(quiz_uuid)
    if (ok == undefined)
      return undefined;

    let sessions_dbres: any;

    let db_client = db.Postgres.client();
    db_client.connect(); {
      try {
        sessions_dbres = await db_client.query(db.Postgres.get('quiz/session/select_quiz_sessions')!, [quiz_uuid, limit, offset]);
      } catch(e: any) {
        logger.debug(e);
        return undefined;
      }
    } db_client.end();
    
    for (let session_row of sessions_dbres.rows) {
      let session: QuizSessionMin = new QuizSessionMin;
      await session.select(session_row['uuid']);
      this.sessions.push(session)
    }
    return this;
  }
}