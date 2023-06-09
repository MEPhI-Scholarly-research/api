import { QuizSession, QuizSessions } from "../../src/models/quizsession";

export async function sessionModelSelect(uuid: string): Promise<boolean> {
  let sessions: QuizSessions | undefined = new QuizSessions;

  sessions = await sessions.select(uuid, 100, 0);
  if (sessions == undefined)
    return false;
  console.log(sessions);

  let session: QuizSession | undefined = new QuizSession;
  session = await session.select(sessions.sessions[0].uuid);
  if (session == undefined)
    return false;
  console.log(session);
  console.log(session.quiz.questions[0]);
  console.log(session.quiz.questions[1]);

  return true;
}