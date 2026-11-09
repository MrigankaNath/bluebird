import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { BadRequestError,UnauthorizedError } from "./api/errors.js";
import type { Request } from "express";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function checkPasswordHash(
  password: string,
  hash: string,
): Promise<boolean> {
  return await argon2.verify(hash, password);
}

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string,
): string {
  const now = Math.floor(Date.now() / 1000);

  const payload: payload = {
    iss: "chirpy",
    sub: userID,
    iat: now,
    exp: now + expiresIn,
  };

  return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const decoded = jwt.verify(tokenString, secret);

    if (typeof decoded === "string") {
      throw new UnauthorizedError("Invalid token payload");
    }

    return decoded.sub!;
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

export function extractBearerToken(
  authorization: string | undefined,
): string {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new BadRequestError("Invalid authorization header");
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    throw new BadRequestError("Token is required");
  }

  return token;
}

export function getBearerToken(req: Request): string {
  const authorization = req.get("Authorization");
  return extractBearerToken(authorization);
}
