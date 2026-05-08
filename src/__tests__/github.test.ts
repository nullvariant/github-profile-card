import { describe, it, expect } from "vitest";
import { GITHUB_USERNAME_REGEX } from "../github";

describe("GITHUB_USERNAME_REGEX", () => {
  it("accepts valid usernames", () => {
    expect(GITHUB_USERNAME_REGEX.test("octocat")).toBe(true);
    expect(GITHUB_USERNAME_REGEX.test("a")).toBe(true);
    expect(GITHUB_USERNAME_REGEX.test("user-name")).toBe(true);
    expect(GITHUB_USERNAME_REGEX.test("a1b2c3")).toBe(true);
  });

  it("rejects usernames starting with hyphen", () => {
    expect(GITHUB_USERNAME_REGEX.test("-user")).toBe(false);
  });

  it("rejects usernames ending with hyphen", () => {
    expect(GITHUB_USERNAME_REGEX.test("user-")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(GITHUB_USERNAME_REGEX.test("")).toBe(false);
  });

  it("rejects usernames with invalid characters", () => {
    expect(GITHUB_USERNAME_REGEX.test("user@name")).toBe(false);
    expect(GITHUB_USERNAME_REGEX.test("user name")).toBe(false);
  });
});
