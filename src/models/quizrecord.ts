/* 
  Quiz record in Redis during test
*/

export class QuizAnswer {
  question: string
  answers: string[]

  constructor() {
    this.question = ''
    this.answers = []
  }
}

export class QuizRecord {
  quiz: string
  start: number
  end: number
  key: string
  answers: QuizAnswer[]

  constructor() {
    this.quiz = ''
    this.start = 0
    this.end = 0
    this.key = ''
    this.answers = []
  }
}