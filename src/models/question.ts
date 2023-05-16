import { Option } from '@/models/option'


export class Question {
  uuid: string
  type: number
  title: string
  description: string
  serial: number
  options: Option[]

  constructor() {
    this.uuid = ''
    this.type = 0
    this.title = ''
    this.description = ''
    this.serial = 0
    this.options = []
  }
}