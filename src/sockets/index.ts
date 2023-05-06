import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

import { logger } from "@/app/logger";
import { SocketQuiz } from "./quiz";
import { DEFAULT_SOCKET_PORT } from "@/constants";

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

    socketQuiz.listenGetFirstCard();
    socketQuiz.listenNextCard();

    socket.on("disconnect", () => {
      logger.info(`SOCKETS DISCONNECTED: ${socket.id}`);
    });
  });

  io.listen(DEFAULT_SOCKET_PORT);
};

export default socketIIFE;
