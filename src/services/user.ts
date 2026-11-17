import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

export async function me(req: Request, res: Response) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      return res.status(401).json({ error: "Необходимо войти в аккаунт" });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера", details: String(error) });
  }
}
