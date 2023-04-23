import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

import { logger } from "@/app/logger";
import { SocketQuiz } from "./quiz";
import { DEFAULT_SOCKET_PORT } from "@/constants";
import { event_quiz_get_next_card } from "@/shared";

const socketIIFE = (server: HttpServer) => {
  const io = new Server(server, {
    serveClient: false,
    cors: {
      origin: "*", // Пока так, потом можно ограничить: http://localhost
      credentials: false,
    },
  });

  io.on("connection", (socket) => {
    logger.info(`SOCKET CONNECTED: ${socket.id}`);
    const socketQuiz = new SocketQuiz(socket);

    socket.on("quiz.content", (data: { id: string }) => {
      console.log(data);
      socketQuiz.sendQuiz(data.id);
    });

    socket.on(event_quiz_get_next_card, (data) => {
      console.log(data);
      setTimeout(() => {
        socket.emit(event_quiz_get_next_card, {
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

    socket.on("disconnect", () => {
      logger.info(`SOCKETS DISCONNECTED: ${socket.id}`);
    });
  });

  io.listen(DEFAULT_SOCKET_PORT);
};

export default socketIIFE;
