import express, { Express } from "express";

import dotenv from "dotenv";
import cors from "cors";
import http from "http";

import { DEFAULT_PORT, DEFAULT_HOST, DEFAULT_SOCKET_PORT } from "./constants";
import socketIIFE from "./sockets";
import routesIIFE from "./endpoints";

import * as test from "../tests/unit"

function tests() {
  test.quizModelSelect("a38c2685-a97e-4b5e-842f-46aeabf27fc8");
  test.sessionModelSelect("ed3b71b6-490c-4887-b377-0d398fdd3d78");
}

function start() {
  dotenv.config();

  const port = process.env.PORT || DEFAULT_PORT;
  const host = process.env.HOST || DEFAULT_HOST;

  const httpServer = express();
  httpServer.set("port", port);
  const server = http.createServer(httpServer);
  var bodyParser = require("body-parser");

  // apply middlewares
  httpServer.use(cors());
  httpServer.use(bodyParser.urlencoded({ extended: false }));
  httpServer.use(bodyParser.json());

  // init IIFE
  socketIIFE(server);
  routesIIFE(httpServer);

  process.on("uncaughtException", (error: Error) => {
    console.log(`Uncaught Exception: ${error.message}`);
  });

  server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
  });
}

let argvs = process.argv.slice(2)
if (argvs.length > 0) {
  if (argvs[0] == "tests")
    tests();
  else
    start();
} else {
  start();
}