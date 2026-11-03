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

  const profaneWords = ["kerfuffle", "sharbert", "fornax"];

  const cleanedBody = chirpBody
    .split(" ")
    .map((word) =>
      profaneWords.includes(word.toLowerCase()) ? "****" : word,
    )
    .join(" ");

  res.status(200).json({ cleanedBody });
}
