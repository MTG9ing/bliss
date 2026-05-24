import { join, resolve } from "node:path";
import type { ModuleMeta, ModuleInstance } from "../types/index.ts";
import { readJson, fileExists } from "../utils/fs.ts";
import { logger } from "../core/logger.ts";
import type { ModuleLoader } from "./types.ts";
import { moduleBundle, getModuleContent, listBuiltInModules } from "./bundle.ts";

export class BuiltInLoader implements ModuleLoader {
  async load(id: string): Promise<ModuleInstance | null> {
    // Check if module exists in bundle
    const moduleFiles = Object.keys(moduleBundle).filter((p) =>
      p.startsWith(id + "/")
    );
    
    if (moduleFiles.length === 0) {
      return null;
    }

    // Find meta.ts content in bundle
    const metaPath = moduleFiles.find((p) => p.endsWith("meta.ts"));
    if (!metaPath) {
      logger.warn(`Built-in module ${id} missing meta.ts in bundle`);
      return null;
    }

    try {
      // We can't dynamic import from bundle strings, so we need a different approach
      // For now, read meta from a JSON file if available, or parse the TS manually
      // Alternative: bundle meta as JSON too
      const metaContent = getModuleContent(metaPath);
      if (!metaContent) return null;

      // Simple extraction: find the exported object
      // This is a hack - better to have meta.json files
      const match = metaContent.match(/const meta:\s*ModuleMeta\s*=\s*(\{[\s\S]*?\});/);
      if (!match) {
        logger.warn(`Could not parse meta for ${id}`);
        return null;
      }

      // Use eval to parse (safe since we control the bundle)
      const meta = eval("(" + match[1] + ")") as ModuleMeta;
      if (!meta) return null;

      return {
        meta,
        source: "built-in",
        path: id, // Use ID as path since we're in bundle mode
        loadedAt: new Date(),
      };
    } catch (err) {
      logger.error(`Failed to load built-in module ${id}: ${(err as Error).message}`);
      return null;
    }
  }

  async list(): Promise<ModuleMeta[]> {
    const ids = listBuiltInModules();
    const metas: ModuleMeta[] = [];
    for (const id of ids) {
      const instance = await this.load(id);
      if (instance) metas.push(instance.meta);
    }
    return metas;
  }
}

export class NpmLoader implements ModuleLoader {
  private prefix = "bliss-module-";

  async load(id: string): Promise<ModuleInstance | null> {
    const pkgName = id.startsWith(this.prefix) ? id : `${this.prefix}${id}`;
    const modulePath = resolve("node_modules", pkgName);

    if (!fileExists(modulePath)) return null;

    const meta = readJson<ModuleMeta>(join(modulePath, "bliss-module.json"));
    if (!meta) {
      logger.warn(`NPM module ${pkgName} missing bliss-module.json`);
      return null;
    }

    return {
      meta,
      source: "npm",
      path: modulePath,
      loadedAt: new Date(),
    };
  }

  async list(): Promise<ModuleMeta[]> {
    const modulesDir = resolve("node_modules");
    if (!fileExists(modulesDir)) return [];

    const dirs = require("node:fs").readdirSync(modulesDir).filter((d: string) => d.startsWith(this.prefix));
    const metas: ModuleMeta[] = [];

    for (const dir of dirs) {
      const instance = await this.load(dir.replace(this.prefix, ""));
      if (instance) metas.push(instance.meta);
    }
    return metas;
  }
}

export class LocalLoader implements ModuleLoader {
  async load(id: string): Promise<ModuleInstance | null> {
    const localPath = resolve(id);
    if (!fileExists(localPath)) return null;

    const meta = readJson<ModuleMeta>(join(localPath, "bliss-module.json"));
    if (!meta) {
      logger.warn(`Local module ${id} missing bliss-module.json`);
      return null;
    }

    return {
      meta,
      source: "local",
      path: localPath,
      loadedAt: new Date(),
    };
  }

  async list(): Promise<ModuleMeta[]> {
    return [];
  }
}