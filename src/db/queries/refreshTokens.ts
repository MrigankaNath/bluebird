import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { NewRefreshToken, refreshTokens, users } from "../schema.js";

export async function createRefreshToken(token: NewRefreshToken) {
  const [result] = await db
    .insert(refreshTokens)
    .values(token)
    .returning();

  return result;
}

export async function userForRefreshToken(token: string) {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .innerJoin(users, eq(refreshTokens.userId, users.id))
    .where(eq(refreshTokens.token, token));

  return result;
}

export async function revokeRefreshToken(token: string) {
  await db
    .update(refreshTokens)
    .set({
      revokedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(refreshTokens.token, token));
}
