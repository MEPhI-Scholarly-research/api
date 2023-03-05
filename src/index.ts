import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import { DEFAULT_PORT } from "./constants";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || DEFAULT_PORT;

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("QAA API");
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
