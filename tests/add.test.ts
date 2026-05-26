import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { injectFeature } from "../src/core/injector.ts";
import { copyFeatureTemplate } from "../src/templates/engine.ts";
import { cleanupTempDir, createBlissConfig, createTempDir } from "./setup.ts";

describe("add command", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir("add-");
    createBlissConfig(tempDir);

    // Create minimal Express entry file
    mkdirSync(join(tempDir, "src"), { recursive: true });
    writeFileSync(
      join(tempDir, "src", "index.ts"),
      `import express from 'express';\nconst app = express();\napp.listen(3000);\n`,
    );
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it("should copy logger feature template", () => {
    const ok = copyFeatureTemplate("logger", tempDir, "typescript");
    expect(ok).toBe(true);
    expect(existsSync(join(tempDir, "src", "lib", "logger.ts"))).toBe(true);
    expect(existsSync(join(tempDir, "src", "middleware", "request-logger.ts"))).toBe(true);
  });

  it("should copy env feature template", () => {
    const ok = copyFeatureTemplate("env", tempDir, "typescript");
    expect(ok).toBe(true);
    expect(existsSync(join(tempDir, "src", "config", "env.ts"))).toBe(true);
  });

  it("should inject logger into Express entry file", () => {
    copyFeatureTemplate("logger", tempDir, "typescript");

    const entryPath = join(tempDir, "src", "index.ts");
    const result = injectFeature(entryPath, "logger", "express");

    expect(result.success).toBe(true);
    expect(result.modified.length).toBeGreaterThan(0);

    const content = readFileSync(entryPath, "utf-8");
    expect(content).toInclude("requestLogger");
    expect(content).toInclude("import");
  });
});
