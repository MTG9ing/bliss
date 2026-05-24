import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createTempDir, cleanupTempDir, createPackageJson, createTsConfig } from "./setup.ts";
import { buildContext, detectFramework, detectLanguage } from "../src/core/detector.ts";
import { createConfig, saveConfig, loadConfig, hasConfig } from "../src/core/config.ts";

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

  it("should detect Express framework from cwd", () => {
    expect(detectFramework(tempDir)).toBe("express");
  });

  it("should detect TypeScript language", () => {
    expect(detectLanguage(tempDir)).toBe("typescript");
  });

  it("should create and load config", () => {
    const config = createConfig("express", "typescript");
    saveConfig(config, tempDir);

    expect(hasConfig(tempDir)).toBe(true);

    // Debug: print what's in the file
    const configPath = join(tempDir, "bliss.config.json");
    const rawContent = readFileSync(configPath, "utf-8");
    console.log("Config file content:", rawContent);

    const loaded = loadConfig(tempDir);
    console.log("Loaded config:", loaded);
    expect(loaded).not.toBeNull();
    expect(loaded?.framework).toBe("express");
    expect(loaded?.language).toBe("typescript");
  });

  it("should build project context", () => {
    const context = buildContext(tempDir);
    expect(context.framework).toBe("express");
    expect(context.language).toBe("typescript");
    expect(context.hasTypeScript).toBe(true);
  });
});