import { quizProcess } from "@/sockets/quiz";
import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { logger } from "@/logger";
import { DEFAULT_SOCKET_PORT } from "@/constants";

function socketIIFE(server: HttpServer) {
  const io = new Server(server, {
    serveClient: false,
    cors: {
      origin: "*",
      credentials: false,
    },
  });

  io.on("connection", (socket) => {
    logger.info(`socket connected: ${socket.id}`);

    quizProcess(socket);

    socket.on("disconnect", () => {
      logger.info(`socket disconnected: ${socket.id}`);
    });
  });

  io.listen(DEFAULT_SOCKET_PORT);
}

export default socketIIFE;
