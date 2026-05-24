import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

export function readFile(path: string): string | null {
  try {
    return readFileSync(path, "utf-8");
  } catch (err) {
    console.error(`[readFile] Failed to read ${path}: ${(err as Error).message}`);
    return null;
  }
}

export function writeFile(path: string, content: string): boolean {
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content, "utf-8");
    return true;
  } catch (err) {
    console.error(`[writeFile] Failed to write ${path}: ${(err as Error).message}`);
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
  } catch (err) {
    console.error(`[ensureDir] Failed to create ${path}: ${(err as Error).message}`);
    return false;
  }
}

export function readJson<T = unknown>(path: string): T | null {
  const content = readFile(path);
  if (!content) {
    console.error(`[readJson] readFile returned null for ${path}`);
    return null;
  }
  try {
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`[readJson] JSON.parse failed for ${path}: ${(err as Error).message}`);
    console.error(`[readJson] Content preview: ${content.slice(0, 100)}`);
    return null;
  }
}

export function writeJson(path: string, data: unknown): boolean {
  return writeFile(path, JSON.stringify(data, null, 2) + "\n");
}