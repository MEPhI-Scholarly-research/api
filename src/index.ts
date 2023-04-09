import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

import { DEFAULT_HTTP_PORT } from "./constants";
import { expressLoggerMiddleware } from "./middlewares/logger/httpLogger";
import socketIIFE from "./sockets";
import routesIIFE from "./http/routes";
import * as db from './app/db'

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT || DEFAULT_HTTP_PORT;
var bodyParser = require('body-parser')

// apply middlewares
app.use(cors());
app.use(expressLoggerMiddleware);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// init databases
db.Postgres.set("insert_quiz")
db.Postgres.set("insert_question_with_answer_options")
db.Postgres.set("select_quiz")

db.Postgres.set("insert_user")
db.Postgres.set("select_user")

db.Postgres.set("insert_token")
db.Postgres.set("select_token")

// init IIFE
socketIIFE(server);
routesIIFE(app);

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://0.0.0.0:${port}`);
});
