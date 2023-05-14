import { Question } from '@/models/question'

export interface Quiz {
  uuid: string
  owner: string
  type: number
  title: string
  description: string
  time_limit: number
  questions: Question[]
}