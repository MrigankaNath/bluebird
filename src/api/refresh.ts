import type { Request, Response } from "express";
import { getBearerToken, makeJWT } from "../auth.js";
import { userForRefreshToken, revokeRefreshToken,} from "../db/queries/refreshTokens.js";
import { UnauthorizedError } from "./errors.js";
import { config } from "../config.js";

export async function handlerRefresh(req: Request, res: Response) {
  const token = getBearerToken(req);

  const result = await userForRefreshToken(token);

  if (!result) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  const refreshToken = result.refresh_tokens;

  if (
    refreshToken.revokedAt !== null ||
    refreshToken.expiresAt <= new Date()
  ) {
    throw new UnauthorizedError("Refresh token is expired or revoked");
  }

  const accessToken = makeJWT(
    result.users.id,
    3600,
    config.api.jwtSecret,
  );

  res.status(200).json({
    token: accessToken,
  });
}

export async function handlerRevoke(req: Request, res: Response) {
  const token = getBearerToken(req);

  await revokeRefreshToken(token);

  res.status(204).end();
}
