import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { createTempDir, cleanupTempDir, createPackageJson, createTsConfig } from "./setup.ts";
import { buildContext } from "../src/core/detector.ts";
import { createConfig, saveConfig, loadConfig } from "../src/core/config.ts";
import { ModuleManager } from "../src/modules/manager.ts";

describe("remove command", () => {
  let tempDir: string;
  let manager: ModuleManager;

  beforeEach(() => {
    tempDir = createTempDir("remove-");
    createPackageJson(tempDir, { express: "^4.18.0" });
    createTsConfig(tempDir);

    const config = createConfig("express", "typescript");
    saveConfig(config, tempDir);

    manager = new ModuleManager();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it("should fail to remove non-installed module", async () => {
    const context = buildContext(tempDir);
    const result = await manager.remove("logger", context);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("should remove installed module", async () => {
    const context = buildContext(tempDir);

    // First install env module
    const installResult = await manager.install("env", context);
    expect(installResult.success).toBe(true);

    // Verify config was updated
    const configAfterInstall = loadConfig(tempDir);
    expect(configAfterInstall).not.toBeNull();
    expect(configAfterInstall!.modules).toContain("env");

    // Then remove
    const result = await manager.remove("env", context);
    expect(result.success).toBe(true);

    // Verify it's removed from config
    const configAfterRemove = loadConfig(tempDir);
    expect(configAfterRemove).not.toBeNull();
    expect(configAfterRemove!.modules).not.toContain("env");
  }, 15000);
});