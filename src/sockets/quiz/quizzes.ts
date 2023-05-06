import { logger } from "@/app/logger";
import {
  event_quiz_get_next_card,
  event_quiz_init_card,
} from "@/shared/socket";
import { SocketMetaPayload } from "@/shared/types";
import { Socket } from "socket.io";

export class SocketQuiz {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  /**
   * Слушает `event_quiz_init_card` и отсылает первую карточку
   */
  public listenGetFirstCard() {
    this.socket.on(event_quiz_init_card, (data: SocketMetaPayload) => {
      // проверки на токены...

      // достаем первую карточку
      setTimeout(() => {
        this.socket.emit(event_quiz_init_card, {
          payload: {
            id: "76a6d4e9-9025-4b1e-86bb-b682c18fb5b3",
            title: "Input some number",
            description:
              "You can do this quiz online or print it on paper. It tests what you learned on our basic grammar rules page.",
            type: "input",
            answer: "/\\d+/",
          },
        });
      }, 2000);
    });
  }

  /**
   * Слушает `event_quiz_get_next_card` и отсылает следующую карточку
   */
  public listenNextCard() {
    this.socket.on(event_quiz_get_next_card, (data: SocketMetaPayload) => {
      // проверки на токены...

      // достаем следующую карточку
      setTimeout(() => {
        this.socket.emit(event_quiz_get_next_card, {
          payload: {
            id: "76a6d4e9-9025-4b1e-86bb-b682c18fb5b3",
            title: "Input some number? ",
            description:
              "You can do this quiz online or print it on paper. It tests what you learned on our basic grammar rules page.",
            type: "input",
            answer: "/\\d+/",
          },
        });
      }, 2000);
    });
  }
}
