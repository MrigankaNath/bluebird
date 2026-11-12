
import type { Request, Response } from "express";
import { createUser, getUserByEmail, updateUser } from "../db/queries/users.js";
import { createRefreshToken } from "../db/queries/refreshTokens.js";
import {
  hashPassword,
  checkPasswordHash,
  makeJWT,
  makeRefreshToken,
  getBearerToken,
  validateJWT,
} from "../auth.js";
import { UnauthorizedError } from "./errors.js";
import { config } from "../config.js";

export async function handlerUsersCreate(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = await hashPassword(password);

  const user = await createUser({ email, hashedPassword });
  const { hashedPassword: _, ...userResponse } = user;

  res.status(201).json(userResponse);
}

export async function handlerUsersLogin(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await getUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError("incorrect email or password");
  }

  const passwordMatches = await checkPasswordHash(
    password,
    user.hashedPassword,
  );
  if (!passwordMatches) {
    throw new UnauthorizedError("incorrect email or password");
  }

  // Access token expires in 1 hour
  const token = makeJWT(user.id, 3600, config.api.jwtSecret);

  // Refresh token expires in 60 days
  const refreshToken = makeRefreshToken();
  const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

  await createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt,
    revokedAt: null,
  });

  const { hashedPassword: _, ...userResponse } = user;

  res.status(200).json({
    ...userResponse,
    token,
    refreshToken,
  });
}

export async function handlerUsersUpdate(req: Request, res: Response) {
  let token: string;

  try {
    token = getBearerToken(req);
  } catch {
    throw new UnauthorizedError("Invalid authorization header");
  }
  const userId = validateJWT(token, config.api.jwtSecret);

  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = await hashPassword(password);

  const user = await updateUser(userId, email, hashedPassword);

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  const { hashedPassword: _, ...userResponse } = user;

  res.status(200).json(userResponse);
}
