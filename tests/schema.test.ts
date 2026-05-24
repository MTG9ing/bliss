import { describe, it, expect } from "bun:test";
import { BlissConfigSchema } from "../src/types/config.ts";

describe("BlissConfigSchema", () => {
  it("should validate a correct config", () => {
    const result = BlissConfigSchema.safeParse({
      version: "2.0.0",
      framework: "express",
      language: "typescript",
      modules: [],
      port: 3000,
      features: { eslint: false, prettier: false, docker: false, tests: false },
      createdAt: "2026-05-24T20:00:00.000Z",
      updatedAt: "2026-05-24T20:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("should validate with minimal fields (defaults)", () => {
    const result = BlissConfigSchema.safeParse({
      framework: "express",
    });
    console.log("Minimal result:", result);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.version).toBe("2.0.0");
      expect(result.data.language).toBe("typescript");
      expect(result.data.port).toBe(3000);
    }
  });

  it("should fail with invalid framework", () => {
    const result = BlissConfigSchema.safeParse({
      framework: "invalid-framework",
    });
    expect(result.success).toBe(false);
  });
});