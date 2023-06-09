import { QuizRecord } from "@/models";

import { logger } from "@/logger";

import { connectionEvent } from "./connection";
import { timeEventSender } from "./time";
import { deleteAnswerEvent } from "./deleteanswer";
import { answerEvent } from "./answer";
import { finishEvent } from "./finish";

export async function quizProcess(socket: any) {
  let session_uuid: string;
  let record: QuizRecord = new QuizRecord();

  logger.info("A new WebSocket connection was established");

  socket.on("message", async (message: string) => {
    const body = JSON.parse(message);
    if (body["type"] == "connection") {
      [session_uuid, record] = await connectionEvent(body["token"]);
      if (session_uuid != "")
        timeEventSender(socket, record.start, record.time_limit);
    } else if (body["type"] == "answer") {
      record = await answerEvent(
        session_uuid,
        record,
        body["question"],
        body["answer"]
      );
    } else if (body["type"] == "delete-answer") {
      record = await deleteAnswerEvent(
        session_uuid,
        record,
        body["question"],
        body["answer"]
      );
    } else if (body["type"] == "finish") {
      await finishEvent(body["token"]);
    } else {
      logger.debug("Undefined message type");
    }
  });

  socket.on("close", () => {
    logger.debug(`Web-Socket connection with uuid '${session_uuid}' closed`);
  });
}
