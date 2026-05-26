import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createConfig, hasConfig, loadConfig, saveConfig } from "../src/core/config.ts";
import {
  buildContext,
  detectFramework,
  detectLanguage,
  detectPackageManager,
} from "../src/core/detector.ts";
import { cleanupTempDir, createPackageJson, createTempDir, createTsConfig } from "./setup.ts";

describe("init command", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir("init-");
    createPackageJson(tempDir, { express: "^4.18.0" });
    createTsConfig(tempDir);
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it("should detect Express framework", () => {
    expect(detectFramework(tempDir)).toBe("express");
  });

  it("should detect TypeScript language", () => {
    expect(detectLanguage(tempDir)).toBe("typescript");
  });

  it("should detect package manager", () => {
    expect(detectPackageManager(tempDir)).toBe("npm"); // default when no lock file
  });

  it("should create and load config", () => {
    const config = createConfig("test-app", "backend", "express", "typescript", "bun");
    saveConfig(config, tempDir);

    expect(hasConfig(tempDir)).toBe(true);

    const loaded = loadConfig(tempDir);
    expect(loaded).not.toBeNull();
    expect(loaded?.project.framework).toBe("express");
    expect(loaded?.project.language).toBe("typescript");
  });

  it("should build project context", () => {
    const context = buildContext(tempDir);
    expect(context.framework).toBe("express");
    expect(context.language).toBe("typescript");
  });
});
