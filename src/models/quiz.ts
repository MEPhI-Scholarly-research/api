import { Question } from '@/models/question'

export class Quiz {
  uuid: string
  owner: string
  type: number
  title: string
  description: string
  time_limit: number
  questions: Question[]

  constructor() {
    this.uuid = ''
    this.owner = ''
    this.type = 0
    this.title = ''
    this.description = ''
    this.time_limit = 0
    this.questions = []
  }
}