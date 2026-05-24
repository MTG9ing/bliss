import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Framework, ProjectContext } from "../types/index.ts";
import { FRAMEWORKS } from "../types/framework.ts";
import { readJson } from "../utils/fs.ts";
import { logger } from "./logger.ts";

const FRAMEWORK_FILES: Record<Framework, string[]> = {
  express: ["express"],
  fastify: ["fastify"],
  hono: ["hono"],
  elysia: ["elysia"],
  koa: ["koa"],
  vanilla: [],
};

export function detectFramework(cwd = process.cwd()): Framework | null {
  const pkgPath = join(cwd, "package.json");
  const pkg = readJson<{ dependencies?: Record<string, string> }>(pkgPath);
  if (!pkg?.dependencies) return null;

  for (const fw of FRAMEWORKS) {
    const pkgs = FRAMEWORK_FILES[fw];
    if (pkgs.some((p) => p in pkg.dependencies!)) {
      logger.debug(`Detected framework: ${fw}`);
      return fw;
    }
  }

  return null;
}

export function detectLanguage(cwd = process.cwd()): "typescript" | "javascript" {
  const hasTsConfig = existsSync(join(cwd, "tsconfig.json"));
  const hasTsFiles = readdirSync(cwd).some((f) => f.endsWith(".ts"));
  return hasTsConfig || hasTsFiles ? "typescript" : "javascript";
}

export function detectPackageManager(cwd = process.cwd()): ProjectContext["packageManager"] {
  if (existsSync(join(cwd, "bun.lockb"))) return "bun";
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

export function buildContext(cwd = process.cwd()): ProjectContext {
  const framework = detectFramework(cwd) ?? "vanilla";
  const language = detectLanguage(cwd);
  const packageManager = detectPackageManager(cwd);

  return {
    cwd,
    framework,
    language,
    hasTypeScript: language === "typescript",
    packageManager,
  };
}