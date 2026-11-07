
import { describe, it, expect } from "vitest";
import { makeJWT, validateJWT } from "./auth.js";

describe("JWT", () => {
  const userID = "test-user-id";
  const secret = "test-secret";

  it("should create and validate a JWT", () => {
    const token = makeJWT(userID, 60, secret);

    const result = validateJWT(token, secret);

    expect(result).toBe(userID);
  });

  it("should reject expired tokens", () => {
    const token = makeJWT(userID, -1, secret);

    expect(() => validateJWT(token, secret)).toThrow();
  });

  it("should reject tokens signed with the wrong secret", () => {
    const token = makeJWT(userID, 60, secret);

    expect(() => validateJWT(token, "wrong-secret")).toThrow();
  });
});
