import type { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { createChirp, getChirps } from "../db/queries/chirps.js";

export async function handlerCreateChirp(req: Request, res: Response) {
  const chirpBody = req.body.body;
  const userId = req.body.userId;
  if (typeof chirpBody !== "string") {
    throw new BadRequestError("Invalid chirp");
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

  const chirp = await createChirp({
    body: cleanedBody,
    userId,
  });
  res.status(201).json(chirp);
}

export async function handlerGetChirps(req: Request, res: Response) {
  const chirps = await getChirps();

  res.status(200).json(chirps);
}
