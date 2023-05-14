import { Option } from '@/models/option'


export interface Question {
  uuid: string
  type: number
  title: string
  description: string
  serial: number
  options: Option[]
}