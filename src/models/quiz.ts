import { Client } from 'pg'

import { logger } from '@/logger'
import * as db from '@/db'

export class Option {
  uuid: string
  question: string
  title: string
  serial: number
  is_correct: boolean

  constructor() {
    this.uuid = ''
    this.question = ''
    this.title = ''
    this.serial = 0
    this.is_correct = false
  }
}

export class Question {
  uuid: string
  type: number
  title: string
  quiz: string
  description: string
  serial: number
  options: Option[]

  constructor() {
    this.uuid = ''
    this.type = 0
    this.title = ''
    this.quiz = ''
    this.description = ''
    this.serial = 0
    this.options = []
  }

  // select options for with question
  async selectOptions(db_client: Client, question_uuid: string): Promise<Question | undefined> {
    let result_options = await db_client.query(db.Postgres.get('quiz/select_options')!, [question_uuid])
    if (result_options.rows[0] == undefined) {
      logger.debug('undefined result_options');
      return undefined;
    }

    for (const row_option of result_options.rows) {
      let option: Option = new Option()

      option.uuid = row_option['uuid']
      option.title = row_option['title']
      option.serial = row_option['serial']
      option.is_correct = row_option['is_correct']

      this.options.push(option)
    }

    return this;
  }
}



export class QuizMin {
  uuid: string
  owner: string
  type: number
  title: string
  description: string
  time_limit: number

  constructor() {
    this.uuid = ''
    this.owner = ''
    this.type = 0
    this.title = ''
    this.description = ''
    this.time_limit = 0
  }

  async select(db_client: Client, quiz_uuid: string): Promise<QuizMin | undefined> {
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

    return this
  }
}

export class Quiz extends QuizMin {
  questions: Question[]

  constructor() {
    super()
    this.questions = []
  }

  override async select(db_client: Client, quiz_uuid: string): Promise<Quiz | undefined> {
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
      let question: Question | undefined = new Question()
      
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