import { Question } from './quiz';
import { Quiz, QuizMin } from './quiz';

import { Client } from 'pg';
import * as db from '@/db';
import { logger } from '@/logger';

class SelectedOption {
  uuid: string;
  title: string;
  serial: number;
  is_correct: boolean;
  selected: boolean;

  constructor() {
    this.uuid = '';
    this.title = '';
    this.serial = 0;
    this.is_correct = false;
    this.selected = false;
  }
}

class QuestionWithSelectedOptions {
  uuid: string;
  type: number;
  title: string;
  description: string;
  serial: number;
  options: SelectedOption[];

  constructor() {
    this.uuid = '';
    this.type = 0;
    this.title = '';
    this.description = '';
    this.serial = 0;
    this.options = [];
  }

  async selectOptions(db_client: Client, question_uuid: string): Promise<QuestionWithSelectedOptions | undefined> {
    let result_options = await db_client.query(db.Postgres.get('quiz/select_options')!, [question_uuid])
    if (result_options.rows[0] == undefined) {
      logger.debug('undefined result_options');
      return undefined;
    }

    for (const row_option of result_options.rows) {
      let option: SelectedOption = new SelectedOption()

      option.uuid = row_option['uuid']
      option.title = row_option['title']
      option.serial = row_option['serial']
      option.is_correct = row_option['is_correct']

      this.options.push(option)
    }

    return this;
  }
}

class QuizWithSelectedOptions extends QuizMin {
  questions: QuestionWithSelectedOptions[];
  constructor() {
    super();
    this.questions = [];
  }

  async select(db_client: Client, quiz_uuid: string): Promise<QuizWithSelectedOptions | undefined> {
    // select quiz meta
    let result_quiz = await db_client.query(db.Postgres.get('quiz/select_quiz')!, [quiz_uuid])
    if (result_quiz.rows[0] == undefined) {
      logger.debug('undefined result_quiz');
      return undefined;
    }
    var row_quiz = result_quiz.rows[0]

    this.uuid = quiz_uuid
    this.owner = row_quiz['owner']
    this.type = row_quiz['type']
    this.title = row_quiz['title']
    this.description = row_quiz['description']
    this.time_limit = row_quiz['time_limit']

    // select quiz questions
    let result_questions = await db_client.query(db.Postgres.get('quiz/select_questions')!, [quiz_uuid])
    if (result_questions.rows[0] == undefined) {
      logger.debug('undefined result_questions');
      return undefined;
    }

    for (const row_question of result_questions.rows) {
      let question: QuestionWithSelectedOptions | undefined = new QuestionWithSelectedOptions()
      
      question.uuid = row_question['uuid']
      question.type = row_question['type']
      question.title = row_question['title']
      question.description = row_question['description']
      question.serial = row_question['serial']

      question = await question.selectOptions(db_client, question.uuid)
      if (question == undefined)
        return undefined

      this.questions.push(question)
    }

    return this
  }
}

export class QuizSessionMin {
  uuid: string
  user: string;
  start: number;
  end: number;
  score: number;

  constructor() {
    this.uuid = '';
    this.user = '';
    this.start = 0;3
    this.end = 0;
    this.score = 0;
  }

  async select(db_client: Client, session_uuid: string): Promise<QuizSessionMin | undefined> {
    let full: QuizSession | undefined = new QuizSession;
    full = await full.select(db_client, session_uuid);
    if (full == undefined)
      return undefined;

    this.uuid = full.uuid;
    this.user = full.user;
    this.score = full.score;
    this.start = full.start;
    this.end = full.end;

    return this
  }
}

// quiz_x_users in database
export class QuizSession extends QuizSessionMin {
  quiz: QuizWithSelectedOptions;

  constructor() {
    super()
    this.quiz = new QuizWithSelectedOptions;
  }

  async select(db_client: Client, session_uuid: string): Promise<QuizSession | undefined> {  
    this.uuid = session_uuid;
    let session_dbres = await db_client.query(db.Postgres.get('quiz/session/select_session') as string, [session_uuid]);
    if (session_dbres.rows[0] == undefined)
      return undefined;
    this.user = session_dbres.rows[0]['user'];
    this.start = session_dbres.rows[0]['start'];
    this.end = session_dbres.rows[0]['end'];
    
    let ok = await this.quiz.select(db_client, session_dbres.rows[0]['quiz']);
    if (ok == undefined)
      return undefined;

    // get user's choice
    let answers_dbres = await db_client.query(db.Postgres.get('quiz/session/select_answers') as string, [session_uuid])
    let answers_map: Map<string, Set<string>> = new Map<string, Set<string>>()
    for (const answer of answers_dbres.rows) {
      if (answers_map.has(answer['question'])) {
        answers_map.set(answer['question'], answers_map.get(answer['question'])?.add(answer['answer'])!);
      } else {
        answers_map.set(answer['question'], new Set<string>);
        answers_map.set(answer['question'], answers_map.get(answer['question'])?.add(answer['answer'])!);
      }
    }
    // sum score
    for (let question of this.quiz.questions) {
      let notok: number = 0;
      for (let option of question.options) {
        if (answers_map.has(question.uuid))
          if (answers_map.get(question.uuid)?.has(option.uuid))
            option.selected = true;
        
        if (option.selected != option.is_correct)
          notok++;
      }
      if (notok == 0)
        this.score++;
    }
  
    return this;
  }
}

export class QuizSessions {
  quiz: QuizMin
  sessions: QuizSessionMin[];

  constructor() {
    this.quiz = new QuizMin
    this.sessions = []
  }

  async select(db_client: Client, quiz_uuid: string, limit: number, offset: number): Promise<QuizSessions | undefined> {
    let ok = this.quiz.select(db_client, quiz_uuid)
    if (ok == undefined)
      return undefined;

    let sessions_dbres = await db_client.query(db.Postgres.get('quiz/session/select_quiz_sessions')!, [quiz_uuid, limit, offset]);
    for (let session_row of sessions_dbres.rows) {
      let session: QuizSessionMin = new QuizSessionMin;
      await session.select(db_client, session_row['uuid']);
      this.sessions.push(session)
    }
    return this;
  }
}