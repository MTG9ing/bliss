import { c } from "../utils/colors.ts";

export type LogLevel = "debug" | "info" | "warn" | "error";

let currentLevel: LogLevel = "info";

export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  return levels[level] >= levels[currentLevel];
}

export const logger = {
  debug: (msg: string) => {
    if (shouldLog("debug")) console.log(c.dim(`[debug] ${msg}`));
  },
  info: (msg: string) => {
    if (shouldLog("info")) console.log(c.info(`ℹ ${msg}`));
  },
  success: (msg: string) => {
    if (shouldLog("info")) console.log(c.success(`✔ ${msg}`));
  },
  warn: (msg: string) => {
    if (shouldLog("warn")) console.warn(c.warning(`⚠ ${msg}`));
  },
  error: (msg: string) => {
    if (shouldLog("error")) console.error(c.error(`✖ ${msg}`));
  },
  step: (msg: string) => {
    if (shouldLog("info")) console.log(c.bold(c.blue(`→ ${msg}`)));
  },
};