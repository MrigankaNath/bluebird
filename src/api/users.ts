import type { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "../auth.js";
import { checkPasswordHash } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { UnauthorizedError } from "./errors.js";


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
  const { hashedPassword: _, ...userResponse } = user;

  res.status(200).json(userResponse);
}
