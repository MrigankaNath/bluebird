
import type { Request, Response } from "express";
import { upgradeUser } from "../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "./errors.js";
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";


export async function handlerPolkaWebhooks(req: Request, res: Response) {
  const apiKey = getAPIKey(req);

  if (apiKey !== config.api.polkaKey) {
    throw new UnauthorizedError("Invalid API key");
  }
  const event = req.body.event;

  if (event !== "user.upgraded") {
    res.status(204).end();
    return;
  }

  const userId = req.body.data.userId;

  const user = await upgradeUser(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.status(204).end();
}
