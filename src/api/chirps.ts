import type { Request, Response } from "express";
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError,} from "./errors.js";
import { createChirp, getChirps, getChirp, deleteChirp,} from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerCreateChirp(req: Request, res: Response) {
  const chirpBody = req.body.body;
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.api.jwtSecret);
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

export async function handlerDeleteChirp(req: Request, res: Response) {
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.api.jwtSecret);

  const chirpId = req.params.chirpId as string;
  const chirp = await getChirp(chirpId);

  if (!chirp) {
    throw new NotFoundError("Chirp not found");
  }

  if (chirp.userId !== userId) {
    throw new ForbiddenError("You are not authorized to delete this chirp");
  }

  await deleteChirp(chirpId);

  res.status(204).end();
}
