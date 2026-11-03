import type { Request, Response } from "express";
import { BadRequestError } from "./errors.js";

export async function handlerValidateChirp(req: Request, res: Response) {
  const chirpBody = req.body.body;

  if (typeof chirpBody !== "string") {
    res.status(400).json({ error: "Invalid chirp" });
    return;
  }

  if (chirpBody.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
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
