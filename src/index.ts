import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import { DEFAULT_PORT } from "./constants";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || DEFAULT_PORT;

app.use(cors());

// handlers

function QuizCreate(req: Request, res: Response) {
  console.log(`Create`);
  
}



// init

app.get("/quiz", QuizCreate);

app.get("/ping", (req: Request, res: Response) => {
  res.json({
    status: "pong",
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://0.0.0.0:${port}`);
});
