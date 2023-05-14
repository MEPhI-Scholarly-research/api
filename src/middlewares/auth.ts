import { Request, NextFunction, Response } from "express";
import { checkAuthJWT } from "@/crypto"
// import { Quiz } from "@/endpoints/quiz"


export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let user = await checkAuthJWT(req.header('Access-Token')!)
    req.headers['user'] = user
  } catch (e) {
    console.log(e)
    return res.status(401).json({})
  }
  next()
};
