import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

/**
 * Clean file operations — no console noise
 * Return null/ false on failure, let caller decide logging
 */

export function readFile(path: string): string | null {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}

export function writeFile(path: string, content: string): boolean {
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content, "utf-8");
    return true;
  } catch {
    return false;
  }
}

export function fileExists(path: string): boolean {
  return existsSync(path);
}

export function ensureDir(path: string): boolean {
  try {
    mkdirSync(path, { recursive: true });
    return true;
  } catch {
    return false;
  }
}

export function removeDir(path: string): boolean {
  try {
    rmSync(path, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}

export function readJson<T = unknown>(path: string): T | null {
  const content = readFile(path);
  if (!content) return null;
  try {
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

export function writeJson(path: string, data: unknown): boolean {
  return writeFile(path, JSON.stringify(data, null, 2) + "\n");
}

export function copyDir(src: string, dest: string): boolean {
  try {
    ensureDir(dest);
    const entries = readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        const content = readFile(srcPath);
        if (content) writeFile(destPath, content);
      }
    }
    return true;
  } catch {
    return false;
  }
}
