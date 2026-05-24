import { BlissConfigSchema, type BlissConfig, type ProjectContext } from "../types/index.ts";
import { readJson, writeJson, fileExists } from "../utils/fs.ts";
import { blissConfigPath } from "../utils/path.ts";
import { logger } from "./logger.ts";

export function loadConfig(cwd = process.cwd()): BlissConfig | null {
  const path = blissConfigPath(cwd);
  const data = readJson<Record<string, unknown>>(path);
  if (!data) {
    console.log(`[loadConfig] readJson returned null for ${path}`);
    return null;
  }

  console.log(`[loadConfig] read data:`, JSON.stringify(data).slice(0, 200));

  const result = BlissConfigSchema.safeParse(data);
  if (!result.success) {
    console.log(`[loadConfig] Zod error:`, result.error.message);
    console.log(`[loadConfig] Zod issues:`, JSON.stringify(result.error.issues, null, 2));
    logger.error("Invalid bliss.config.json");
    return null;
  }
  return result.data;
}

export function saveConfig(config: BlissConfig, cwd = process.cwd()): boolean {
  const path = blissConfigPath(cwd);
  const updated = {
    ...config,
    updatedAt: new Date().toISOString(),
  };
  const ok = writeJson(path, updated);
  if (ok) logger.success(`Saved config to ${path}`);
  return ok;
}

export function createConfig(
  framework: ProjectContext["framework"],
  language: ProjectContext["language"],
  overrides: Partial<BlissConfig> = {},
): BlissConfig {
  return BlissConfigSchema.parse({
    version: "2.0.0",
    framework,
    language,
    modules: [],
    port: 3000,
    features: {
      eslint: false,
      prettier: false,
      docker: false,
      tests: false,
    },
    createdAt: new Date().toISOString(),
    ...overrides,
  });
}

export function hasConfig(cwd = process.cwd()): boolean {
  return fileExists(blissConfigPath(cwd));
}

export function addModuleToConfig(moduleId: string, cwd = process.cwd()): boolean {
  const config = loadConfig(cwd);
  if (!config) return false;
  if (config.modules.includes(moduleId)) return true;
  config.modules.push(moduleId);
  return saveConfig(config, cwd);
}

export function removeModuleFromConfig(moduleId: string, cwd = process.cwd()): boolean {
  const config = loadConfig(cwd);
  if (!config) return false;
  config.modules = config.modules.filter((m) => m !== moduleId);
  return saveConfig(config, cwd);
}