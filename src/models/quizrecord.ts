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
  quiz: string = '';
  user: string = '';
  start: number = 0;
  time_limit: number = 0;
  key: string = "";
  answers: QuizAnswer[] = [];

  public constructor(init?:Partial<QuizRecord>) {
    Object.assign(this, init);
  }
}