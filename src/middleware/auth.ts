import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      return res
        .status(401)
        .json({ error: "Необходимо войти в аккаунт" });
    }
    res.locals.user = session.user;
    next();
  } catch (error) {
    next(error);
  }
}
