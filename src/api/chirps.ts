import type { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { createChirp, getChirps, getChirp } from "../db/queries/chirps.js";

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

export async function handlerGetChirp(req: Request, res: Response) {
  const chirpId = req.params.chirpId as string;

  const chirp = await getChirp(chirpId);

  if (!chirp) {
    res.status(404).json({ error: "Chirp not found" });
    return;
  }

  res.status(200).json(chirp);
}
