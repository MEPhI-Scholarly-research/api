import { Request, Response } from "express";
import * as db from '../../../app/db'

// json array serial: https://www.rfc-editor.org/rfc/rfc7159.txt

export interface Quiz extends Request {
  body: {
    title: string
    owner: string
    questions_with_answer_options: [
      {
        title: string
        qtype: string
        serial_number: number
        answer_options: [
          {
            title: string
          }
        ]
      }
    ]
  }
}

export async function quizPost(req: Quiz, res: Response) {
  let body = req.body ?? null;
  if (body == null)
    return res.status(400).json({});

  // create database response
  let client = db.Postgres.client();
  await client.connect();
  
  let titles: string[] = [];
  let qtypes: string[] = [];
  let serial_numbers = [];
  for (const question of body.questions_with_answer_options) {
    qtypes.push(question.qtype)
    serial_numbers.push(question.serial_number)
  }

  // insert quiz with initializing all questions
  const result = await client.query(
      db.Postgres.get("insert_quiz")!, 
      ['root', body.title, serial_numbers, qtypes]);
  // get questions uuids
  let question_uuids: string[] = [];
  for await (const row of result.rows)
    question_uuids.push(row['uuid'] as string);
  // inserting all questions in their tables
  let index = 0;
  // insert questions with answer options
  for (const question of body.questions_with_answer_options) {
    let answer_options: string[] = [];
    for (const answer_option of body.questions_with_answer_options[index].answer_options)
      answer_options.push(answer_option.title);
    const result = await client.query(
        db.Postgres.get("insert_question_with_answer_options")!,
        [question_uuids[index], question.title, answer_options]);
    for await (const row of result.rows)
      row['uuid'];
    index += 1;
  }

  await client.end()

  res.status(200).json({
    message: "data",
  });
}