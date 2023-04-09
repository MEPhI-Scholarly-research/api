import { Request, Response } from "express";

export function error(handler: (req: Request, res: Response) => void): 
    (req: Request, res: Response) => void {
  return function (req: Request, res: Response) {
    try {
      handler(req, res);
    } catch(e) {
      console.log(e as string);
      res.status(500);
    }
  }
}