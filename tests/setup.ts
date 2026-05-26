import { mock } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { setLogToFile } from "../src/core/logger.ts";

// Disable file logging during tests to avoid noise
setLogToFile(false);

// Mock process.exit to prevent tests from killing the runner
mock.module("process", () => ({
  ...process,
  exit: (code?: number) => {
    throw new Error(`process.exit(${code})`);
  },
}));

// Test utilities
export function createTempDir(prefix = "bliss-test-"): string {
  const dir = join(process.cwd(), "node_modules", ".bliss-tests", `${prefix}${Date.now()}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function cleanupTempDir(dir: string): void {
  rmSync(dir, { recursive: true, force: true });
}

export function createPackageJson(dir: string, deps: Record<string, string> = {}): void {
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: "test-project", version: "1.0.0", dependencies: deps }, null, 2),
  );
}

export function createTsConfig(dir: string): void {
  writeFileSync(
    join(dir, "tsconfig.json"),
    JSON.stringify({ compilerOptions: { target: "ES2022" } }, null, 2),
  );
}

export function createBlissConfig(dir: string, overrides: Record<string, unknown> = {}): void {
  const blissDir = join(dir, ".bliss");
  mkdirSync(blissDir, { recursive: true }); // ← ADD THIS

  writeFileSync(
    join(blissDir, "config.json"),
    JSON.stringify(
      {
        version: "2.1.0",
        project: {
          name: "test",
          type: "backend",
          framework: "express",
          language: "typescript",
          entryFile: "src/index.ts",
        },
        packageManager: "bun",
        features: [],
        ...overrides,
      },
      null,
      2,
    ),
  );
}
