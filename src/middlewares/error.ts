import { Request, NextFunction, Response } from "express";


export const errorMiddleware = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error)
  if (error != null) {
    console.log('inside')
    const status = 500;
    const message = 'Something went wrong';
    res.status(status).end()
  }
  next()
};
