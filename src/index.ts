import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

import { DEFAULT_HTTP_PORT } from "@/constants";
import { authMiddleware, expressLoggerMiddleware } from "@/middlewares";
import socketIIFE from "@/sockets";
import routesIIFE from "@/http/routes";

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT || DEFAULT_HTTP_PORT;

// apply middlewares
app.use(cors());
app.use(expressLoggerMiddleware);
app.use(authMiddleware);

// init IIFE
socketIIFE(server);
routesIIFE(app);

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://0.0.0.0:${port}`);
});
