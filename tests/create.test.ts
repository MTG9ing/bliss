import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { scaffoldProject } from "../src/templates/engine.ts";
import { cleanupTempDir, createTempDir } from "./setup.ts";

describe("create command", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir("create-");
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it("should scaffold an Express TypeScript project", () => {
    const context = {
      projectName: "test-api",
      framework: "express" as const,
      language: "typescript" as const,
      packageManager: "bun" as const,
      features: [],
      includeTests: true,
      includeGit: true,
    };

    const ok = scaffoldProject(tempDir, context);
    expect(ok).toBe(true);

    expect(existsSync(join(tempDir, "package.json"))).toBe(true);
    expect(existsSync(join(tempDir, "tsconfig.json"))).toBe(true);
    expect(existsSync(join(tempDir, ".gitignore"))).toBe(true);
    expect(existsSync(join(tempDir, "src", "index.ts"))).toBe(true);
    expect(existsSync(join(tempDir, "src", "app.ts"))).toBe(true);
  });

  it("should scaffold a Fastify JavaScript project", () => {
    const context = {
      projectName: "fastify-app",
      framework: "fastify" as const,
      language: "javascript" as const,
      packageManager: "npm" as const,
      features: [],
      includeTests: false,
      includeGit: false,
    };

    const ok = scaffoldProject(tempDir, context);
    expect(ok).toBe(true);

    expect(existsSync(join(tempDir, "package.json"))).toBe(true);
    expect(existsSync(join(tempDir, "jsconfig.json"))).toBe(true);
    expect(existsSync(join(tempDir, "src", "index.js"))).toBe(true);
    expect(existsSync(join(tempDir, "src", "app.js"))).toBe(true);
  });

  it("should include framework dependency in package.json", () => {
    const context = {
      projectName: "vanilla-app",
      framework: "vanilla" as const,
      language: "typescript" as const,
      packageManager: "bun" as const,
      features: [],
      includeTests: true,
      includeGit: false,
    };

    scaffoldProject(tempDir, context);

    const pkg = JSON.parse(readFileSync(join(tempDir, "package.json"), "utf-8"));
    expect(pkg.type).toBe("module");
    expect(pkg.devDependencies.vitest).toBeDefined();
    expect(pkg.devDependencies["@biomejs/biome"]).toBeDefined();
  });
});
