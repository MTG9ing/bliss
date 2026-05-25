import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Framework, Language, PackageManager, ProjectType } from "../types/framework.ts";
import { FRAMEWORKS, FRAMEWORK_PATTERNS, FRAMEWORK_META } from "../types/framework.ts";
import { readJson, readFile, fileExists } from "../utils/fs.ts";
import { logger } from "./logger.ts";

/**
 * Detect framework from package.json dependencies
 */
export function detectFramework(cwd = process.cwd()): Framework | null {
  const pkgPath = join(cwd, "package.json");
  const pkg = readJson<{ dependencies?: Record<string, string>; devDependencies?: Record<string, string> }>(pkgPath);
  if (!pkg) return null;

  const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

  for (const fw of FRAMEWORKS) {
    const meta = FRAMEWORK_META[fw];
    if (meta.packageName && meta.packageName in allDeps) {
      logger.debug(`Detected framework: ${fw}`);
      return fw;
    }
  }

  return null;
}

/**
 * Detect language from tsconfig.json and .ts files
 */
export function detectLanguage(cwd = process.cwd()): Language {
  const hasTsConfig = fileExists(join(cwd, "tsconfig.json"));
  const hasTsFiles = readdirSync(cwd, { recursive: true }).some(
    (f) => typeof f === "string" && f.endsWith(".ts") && !f.endsWith(".d.ts")
  );
  return hasTsConfig || hasTsFiles ? "typescript" : "javascript";
}

/**
 * Detect package manager from lock files
 */
export function detectPackageManager(cwd = process.cwd()): PackageManager {
  if (fileExists(join(cwd, "bun.lockb"))) return "bun";
  if (fileExists(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fileExists(join(cwd, "yarn.lock"))) return "yarn";
  if (fileExists(join(cwd, "package-lock.json"))) return "npm";
  return "npm"; // Default fallback
}

/**
 * Detect project type from directory contents
 */
export function detectProjectType(cwd = process.cwd()): ProjectType {
  const pkgPath = join(cwd, "package.json");
  const pkg = readJson<{ name?: string; dependencies?: Record<string, string> }>(pkgPath);

  if (!pkg) return "starter";

  // Check for backend frameworks
  if (detectFramework(cwd)) return "backend";

  // Check for library indicators
  if (pkg.name?.startsWith("@") || pkg.name?.includes("lib")) return "library";

  return "starter";
}

/**
 * Detect entry file using multi-strategy approach
 * Strategy 1: .bliss/config.json
 * Strategy 2: package.json "main" field
 * Strategy 3: Framework convention files
 * Strategy 4: Return null (caller prompts user)
 */
export function detectEntryFile(cwd: string, framework: Framework): string | null {
  // Strategy 1: Config file
  const configPath = join(cwd, ".bliss", "config.json");
  const config = readJson<{ project?: { entryFile?: string } }>(configPath);
  if (config?.project?.entryFile) {
    const path = join(cwd, config.project.entryFile);
    if (fileExists(path) && validateEntryFile(path, framework)) {
      logger.debug(`Entry file from config: ${config.project.entryFile}`);
      return config.project.entryFile;
    }
  }

  // Strategy 2: package.json main
  const pkg = readJson<{ main?: string }>(join(cwd, "package.json"));
  if (pkg?.main) {
    const path = join(cwd, pkg.main);
    if (fileExists(path) && validateEntryFile(path, framework)) {
      logger.debug(`Entry file from package.json main: ${pkg.main}`);
      return pkg.main;
    }
  }

  // Strategy 3: Framework conventions
  const candidates = FRAMEWORK_META[framework].entryFiles;
  for (const candidate of candidates) {
    const path = join(cwd, candidate);
    if (fileExists(path) && validateEntryFile(path, framework)) {
      logger.debug(`Entry file from conventions: ${candidate}`);
      return candidate;
    }
  }

  logger.debug("No entry file detected");
  return null;
}

/**
 * Validate that a file is actually an entry file for the given framework
 */
export function validateEntryFile(path: string, framework: Framework): boolean {
  const content = readFile(path);
  if (!content) return false;

  const patterns = FRAMEWORK_PATTERNS[framework];
  return patterns.some((p) => p.test(content));
}

/**
 * Build complete project context
 */
export function buildContext(cwd = process.cwd()): {
  cwd: string;
  framework: Framework;
  language: Language;
  packageManager: PackageManager;
  projectType: ProjectType;
  entryFile: string | null;
} {
  const framework = detectFramework(cwd) ?? "vanilla";
  const language = detectLanguage(cwd);
  const packageManager = detectPackageManager(cwd);
  const projectType = detectProjectType(cwd);
  const entryFile = detectEntryFile(cwd, framework);

  return {
    cwd,
    framework,
    language,
    packageManager,
    projectType,
    entryFile,
  };
}
