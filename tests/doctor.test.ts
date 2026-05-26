import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { hasConfig, loadConfig } from "../src/core/config.ts";
import { cleanupTempDir, createBlissConfig, createPackageJson, createTempDir } from "./setup.ts";

describe("doctor command", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir("doctor-");
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it("should detect missing config", () => {
    expect(hasConfig(tempDir)).toBe(false);
  });

  it("should validate existing config", () => {
    createPackageJson(tempDir, { express: "^4.18.0" });
    createBlissConfig(tempDir);

    expect(hasConfig(tempDir)).toBe(true);

    const config = loadConfig(tempDir);
    expect(config).not.toBeNull();
    expect(config?.project.framework).toBe("express");
  });

  it("should detect missing node_modules", () => {
    expect(existsSync(join(tempDir, "node_modules"))).toBe(false);
  });
});
