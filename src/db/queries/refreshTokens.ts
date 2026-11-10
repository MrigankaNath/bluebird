import { db } from "../index.js";
import { NewRefreshToken, refreshTokens } from "../schema.js";

export async function createRefreshToken(token: NewRefreshToken) {
  const [result] = await db
    .insert(refreshTokens)
    .values(token)
    .returning();

  return result;
}
