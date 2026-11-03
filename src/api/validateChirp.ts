
import type { Request, Response } from "express";

export function handlerValidateChirp(req: Request, res: Response) {
  const chirpBody = req.body.body;

  if (typeof chirpBody !== "string") {
    res.status(400).json({ error: "Invalid chirp" });
    return;
  }

  if (chirpBody.length > 140) {
    res.status(400).json({ error: "Chirp is too long" });
    return;
  }

  res.status(200).json({ valid: true });
}
