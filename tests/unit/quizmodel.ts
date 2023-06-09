import { Quiz } from "../../src/models/quiz";

export async function quizModelSelect(uuid: string): Promise<boolean> {
  let quiz: Quiz | undefined = new Quiz;

  quiz = await quiz.select(uuid);
  if (quiz == undefined)
    return false;

  console.log(quiz);
  console.log(quiz.questions[0]);
  return true;
}