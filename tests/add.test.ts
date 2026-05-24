import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createTempDir, cleanupTempDir, createPackageJson, createTsConfig } from "./setup.ts";
import { buildContext } from "../src/core/detector.ts";
import { createConfig, saveConfig } from "../src/core/config.ts";
import { ModuleManager } from "../src/modules/manager.ts";

describe("add command", () => {
  let tempDir: string;
  let manager: ModuleManager;

  beforeEach(() => {
    tempDir = createTempDir("add-");
    createPackageJson(tempDir, { express: "^4.18.0" });
    createTsConfig(tempDir);

    const config = createConfig("express", "typescript");
    saveConfig(config, tempDir);

    manager = new ModuleManager();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it("should list available modules", async () => {
    const available = await manager.listAvailable();
    expect(available.length).toBeGreaterThan(0);
    expect(available.some((m) => m.id === "logger")).toBe(true);
  });

  it("should resolve built-in module", async () => {
    const instance = await manager.resolve("logger");
    expect(instance).not.toBeNull();
    expect(instance?.meta.id).toBe("logger");
    expect(instance?.source).toBe("built-in");
  });

  it("should fail to resolve unknown module", async () => {
    const instance = await manager.resolve("nonexistent");
    expect(instance).toBeNull();
  });

  it("should track installed modules", () => {
    const context = buildContext(tempDir);
    const installed = manager.listInstalled(context);
    expect(Array.isArray(installed)).toBe(true);
  });
});