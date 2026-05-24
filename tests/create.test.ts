import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createTempDir, cleanupTempDir, createPackageJson } from "./setup.ts";
import { scaffoldFromTemplate, buildTemplateContext } from "../src/templates/engine.ts";

// Resolve template directory relative to project root
function getTemplateDir(subPath: string): string {
  const base = import.meta.dirname || process.cwd();
  const projectRoot = base.endsWith("tests") ? resolve(base, "..") : base;
  return resolve(projectRoot, subPath);
}

describe("create command", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir("create-");
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it("should scaffold an Express project", () => {
    const context = {
      cwd: tempDir,
      framework: "express" as const,
      language: "typescript" as const,
      hasTypeScript: true,
      packageManager: "bun" as const,
    };

    const data = buildTemplateContext("test-api", context, {
      eslint: true,
      prettier: true,
      docker: false,
      tests: true,
    });

    const baseDir = getTemplateDir("src/templates/base");
    const generated = scaffoldFromTemplate(baseDir, tempDir, data);

    expect(generated.length).toBeGreaterThan(0);
    expect(existsSync(join(tempDir, "package.json"))).toBe(true);
    expect(existsSync(join(tempDir, "tsconfig.json"))).toBe(true);
    // gitignore might be named .gitignore or gitignore depending on template
    const hasGitignore = existsSync(join(tempDir, ".gitignore")) || existsSync(join(tempDir, "gitignore"));
    expect(hasGitignore).toBe(true);
  });

  it("should include framework in package.json", () => {
    const context = {
      cwd: tempDir,
      framework: "fastify" as const,
      language: "javascript" as const,
      hasTypeScript: false,
      packageManager: "npm" as const,
    };

    const data = buildTemplateContext("fastify-app", context, {
      eslint: false,
      prettier: false,
      docker: false,
      tests: false,
    });

    const baseDir = getTemplateDir("src/templates/base");
    scaffoldFromTemplate(baseDir, tempDir, data);

    const pkg = JSON.parse(readFileSync(join(tempDir, "package.json"), "utf-8"));
    expect(pkg.dependencies.fastify).toBeDefined();
  });
});