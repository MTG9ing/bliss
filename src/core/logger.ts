import { readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { c } from "../utils/colors.ts";
import { ensureDir, readFile, writeFile } from "../utils/fs.ts";
import { blissLogPath } from "../utils/path.ts";

export type LogLevel = "debug" | "info" | "success" | "warn" | "error" | "step";

let currentLevel: LogLevel = "info";
let logToFile = true;
let customCwd: string | null = null;

export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

export function setLogToFile(enabled: boolean): void {
  logToFile = enabled;
}

/**
 * Set custom working directory for logs
 * Useful for CLI commands that want to log to a specific project directory
 */
export function setLogCwd(cwd: string | null): void {
  customCwd = cwd;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  step: 1,
  success: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[currentLevel];
}

function writeToLogFile(level: LogLevel, message: string): void {
  if (!logToFile) return;
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  const path = blissLogPath(customCwd || process.cwd());
  const dir = dirname(path);

  try {
    // Ensure directory exists first
    const dirCreated = ensureDir(dir);
    if (!dirCreated) {
      console.error(`[Logger Error] Failed to create log directory: ${dir}`);
      return;
    }

    const existing = readFileSync(path, "utf-8") || "";
    writeFileSync(path, existing + line, "utf-8");
  } catch (err) {
    // Log to console on failure instead of silently failing
    console.error(
      `[Logger Error] Failed to write to log file at ${path}: ${(err as Error).message}`,
    );
  }
}

export const logger = {
  debug: (msg: string) => {
    if (shouldLog("debug")) console.log(c.dim(`[debug] ${msg}`));
    writeToLogFile("debug", msg);
  },
  info: (msg: string) => {
    if (shouldLog("info")) console.log(c.info(`ℹ ${msg}`));
    writeToLogFile("info", msg);
  },
  success: (msg: string) => {
    if (shouldLog("success")) console.log(c.success(`✔ ${msg}`));
    writeToLogFile("success", msg);
  },
  warn: (msg: string) => {
    if (shouldLog("warn")) console.warn(c.warning(`⚠ ${msg}`));
    writeToLogFile("warn", msg);
  },
  error: (msg: string) => {
    if (shouldLog("error")) console.error(c.error(`✖ ${msg}`));
    writeToLogFile("error", msg);
  },
  step: (msg: string) => {
    if (shouldLog("step")) console.log(c.bold(c.blue(`→ ${msg}`)));
    writeToLogFile("step", msg);
  },
};
