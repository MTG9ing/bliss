import { mock } from "bun:test";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

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
    JSON.stringify({ name: "test-project", version: "1.0.0", dependencies: deps }, null, 2)
  );
}

export function createTsConfig(dir: string): void {
  writeFileSync(
    join(dir, "tsconfig.json"),
    JSON.stringify({ compilerOptions: { target: "ES2022" } }, null, 2)
  );
}