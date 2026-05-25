import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Path utilities for Bliss CLI
 */

export function projectRoot(cwd = process.cwd()): string {
  return resolve(cwd);
}

export function blissDir(cwd = process.cwd()): string {
  return join(cwd, ".bliss");
}

export function blissConfigPath(cwd = process.cwd()): string {
  return join(blissDir(cwd), "config.json");
}

export function blissLogsDir(cwd = process.cwd()): string {
  return join(blissDir(cwd), "logs");
}

export function blissLogPath(cwd = process.cwd()): string {
  const date = new Date().toISOString().slice(0, 10);
  return join(blissLogsDir(cwd), `${date}.log`);
}

export function moduleBackupPath(cwd: string, moduleId: string): string {
  return join(blissDir(cwd), "backups", moduleId);
}

export function getBlissRoot(): string {
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFile);

  // Built to dist/utils/path.js — go up to project root
  if (currentDir.includes("dist")) {
    return resolve(currentDir, "..", "..");
  }

  // Source mode: src/utils/ — go up to project root
  if (currentDir.includes("src")) {
    return resolve(currentDir, "..", "..");
  }

  return resolve(currentDir, "..");
}

export function getTemplatePath(subPath: string): string {
  return resolve(getBlissRoot(), "src", "templates", subPath);
}
