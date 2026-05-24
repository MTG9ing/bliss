import { resolve, relative, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export function projectRoot(cwd = process.cwd()): string {
  return resolve(cwd);
}

export function relPath(from: string, to: string): string {
  return relative(from, to);
}

export function blissDir(cwd = process.cwd()): string {
  return join(cwd, ".bliss");
}

export function blissConfigPath(cwd = process.cwd()): string {
  return join(cwd, "bliss.config.json");
}

export function moduleBackupPath(cwd: string, moduleId: string): string {
  return join(blissDir(cwd), "backups", moduleId);
}

export function getBlissRoot(): string {
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFile);
  
  // Built to dist/index.js — go up one more level
  if (currentDir.endsWith("dist")) {
    return resolve(currentDir, "..");
  }
  
  // Source mode: src/commands/ or similar
  if (currentDir.includes("src")) {
    return resolve(currentDir, "..");
  }
  
  return currentDir;
}

export function getTemplatePath(subPath: string): string {
  return resolve(getBlissRoot(), "src/templates", subPath);
}