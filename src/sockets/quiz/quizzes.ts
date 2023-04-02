import { logger } from "@/app/logger";
import { Socket } from "socket.io";

export class SocketQuiz {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  public sendQuiz(id?: string) {
    // достаем какой-то квиз по id

    if (id === undefined) {
      logger.error("id must be not undefined");
    }

    if (id === "1234") {
      const fakeQuiz = {
        id: "34f0af53",
        active: true,
        data: [
          {
            id: "aa13f0c3c1201f36787fd3397c0bfb4e",
            type: "input",
            title: "How are you?",
            description: "Fine?",
            answer: "^(fine|good)$",
          },
        ],
      };

      this.socket.emit("quiz.content", fakeQuiz);
    }
  }
}
