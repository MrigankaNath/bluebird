
import { describe, it, expect } from "vitest";
import { makeJWT, validateJWT, extractBearerToken } from "./auth.js";
import { BadRequestError } from "./api/errors.js";

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


describe("extractBearerToken", () => {
  it("should extract a token from a valid Bearer header", () => {
    const result = extractBearerToken("Bearer abc123");
    expect(result).toBe("abc123");
  });
  it("should trim whitespace around the token", () => {
    const result = extractBearerToken("Bearer   abc123  ");
    expect(result).toBe("abc123");
  });

  it("should reject an invalid authorization scheme", () => {
    expect(() => extractBearerToken("Basic abc123")).toThrow(
      BadRequestError,
    );
  });

  it("should reject a missing or empty token", () => {
    expect(() => extractBearerToken("Bearer ")).toThrow(
      BadRequestError,
    );

    expect(() => extractBearerToken(undefined)).toThrow(
      BadRequestError,
    );
  });
});
