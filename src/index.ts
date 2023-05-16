import express, { Express } from "express"
import * as socketio from "socket.io";

import dotenv from "dotenv"
import cors from "cors"
import http from "http"

import { DEFAULT_PORT, DEFAULT_HOST, DEFAULT_SOCKET_PORT } from "./constants"
import socketIIFE from "./sockets"
import routesIIFE from "./endpoints"
import * as db from './db'

dotenv.config();

const port = process.env.PORT || DEFAULT_PORT;
const host = process.env.HOST || DEFAULT_HOST;

const httpServer = express();
httpServer.set("port", port)
const server = http.createServer(httpServer);
const socketServer = require("socket.io")(server);
var bodyParser = require('body-parser')

// apply middlewares
httpServer.use(cors());
httpServer.use(bodyParser.urlencoded({ extended: false }))
httpServer.use(bodyParser.json())

// init databases
db.Postgres.set("user/insert_user")
db.Postgres.set("user/select_user")
db.Postgres.set("user/insert_token")
db.Postgres.set("user/select_token")

db.Postgres.set("quiz/insert_option")
db.Postgres.set("quiz/insert_question")
db.Postgres.set("quiz/insert_quiz")
db.Postgres.set("quiz/select_options")
db.Postgres.set("quiz/select_questions")
db.Postgres.set("quiz/select_quiz")

db.Postgres.set("quiz/start_quiz")
db.Postgres.set("quiz/finish_quiz")

// init IIFE
socketIIFE(socketServer);
routesIIFE(httpServer);

process.on('uncaughtException', (error: Error) => {
  console.log(`Uncaught Exception: ${error.message}`);
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});