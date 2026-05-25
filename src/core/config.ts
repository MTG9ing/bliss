import { BlissConfigSchema, type BlissConfig, type Framework, type Language, type PackageManager } from "../types/index.ts";
import { readJson, writeJson, fileExists, ensureDir } from "../utils/fs.ts";
import { blissConfigPath, blissDir } from "../utils/path.ts";
import { logger } from "./logger.ts";

/**
 * Load and validate config from .bliss/config.json
 */
export function loadConfig(cwd = process.cwd()): BlissConfig | null {
  const path = blissConfigPath(cwd);
  if (!fileExists(path)) {
    logger.debug(`No config found at ${path}`);
    return null;
  }

  const data = readJson<Record<string, unknown>>(path);
  if (!data) {
    logger.warn(`Failed to read config at ${path}`);
    return null;
  }

  const result = BlissConfigSchema.safeParse(data);
  if (!result.success) {
    logger.error(`Invalid config at ${path}: ${result.error.message}`);
    return null;
  }

  return result.data;
}

/**
 * Save config to .bliss/config.json
 */
export function saveConfig(config: BlissConfig, cwd = process.cwd()): boolean {
  ensureDir(blissDir(cwd));
  const path = blissConfigPath(cwd);
  const updated = {
    ...config,
    updatedAt: new Date().toISOString(),
  };

  const ok = writeJson(path, updated);
  if (ok) {
    logger.success(`Saved config to ${path}`);
    logger.debug(`Config content: ${JSON.stringify(updated, null, 2)}`);
  } else {
    logger.error(`Failed to save config to ${path}`);
  }
  return ok;
}

/**
 * Check if config exists
 */
export function hasConfig(cwd = process.cwd()): boolean {
  return fileExists(blissConfigPath(cwd));
}

/**
 * Create new config with defaults
 */
export function createConfig(
  name: string,
  type: BlissConfig["project"]["type"],
  framework: Framework,
  language: Language,
  packageManager: PackageManager,
  entryFile = "src/index.ts"
): BlissConfig {
  return BlissConfigSchema.parse({
    version: "2.1.0",
    project: {
      name,
      type,
      framework,
      language,
      structure: "standard",
      entryFile,
    },
    packageManager,
    features: [],
    git: {
      initialized: false,
    },
    github: {
      authenticated: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Add feature to config
 */
export function addFeature(featureId: string, cwd = process.cwd()): boolean {
  const config = loadConfig(cwd);
  if (!config) return false;
  if (config.features.includes(featureId)) return true;

  config.features.push(featureId);
  return saveConfig(config, cwd);
}

/**
 * Remove feature from config
 */
export function removeFeature(featureId: string, cwd = process.cwd()): boolean {
  const config = loadConfig(cwd);
  if (!config) return false;

  config.features = config.features.filter((f) => f !== featureId);
  return saveConfig(config, cwd);
}

/**
 * Update entry file in config
 */
export function updateEntryFile(entryFile: string, cwd = process.cwd()): boolean {
  const config = loadConfig(cwd);
  if (!config) return false;

  config.project.entryFile = entryFile;
  return saveConfig(config, cwd);
}

/**
 * Migrate config from older version
 * Future-proofing for v2.2, v3.0, etc.
 */
export function migrateConfig(data: Record<string, unknown>): BlissConfig | null {
  const version = (data.version as string) || "unknown";

  // v2.0 -> v2.1 migration
  if (version.startsWith("2.0")) {
    logger.step("Migrating config from v2.0 to v2.1");
    // Add new fields with defaults
    const migrated = {
      ...data,
      version: "2.1.0",
      project: {
        structure: "standard",
        ...((data.project as Record<string, unknown>) || {}),
      },
      git: {
        initialized: false,
        ...(data.git || {}),
      },
      github: {
        authenticated: false,
        ...(data.github || {}),
      },
    };
    const result = BlissConfigSchema.safeParse(migrated);
    return result.success ? result.data : null;
  }

  // Current version
  const result = BlissConfigSchema.safeParse(data);
  return result.success ? result.data : null;
}
