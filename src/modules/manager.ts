import type { ModuleMeta, InjectionResult, RemovalResult, ProjectContext } from "../types/index.ts";
import { injectModule, restoreModuleBackup } from "../core/injector.ts";
import { installPackages, uninstallPackages } from "../core/installer.ts";
import { addModuleToConfig, removeModuleFromConfig, loadConfig } from "../core/config.ts";
import { logger } from "../core/logger.ts";
import type { IModuleManager } from "./types.ts";
import { BuiltInLoader, NpmLoader, LocalLoader } from "./loader.ts";
import { InMemoryRegistry } from "./registry.ts";

export class ModuleManager implements IModuleManager {
  private registry = new InMemoryRegistry();
  private loaders = {
    builtIn: new BuiltInLoader(),
    npm: new NpmLoader(),
    local: new LocalLoader(),
  };

  async resolve(id: string): Promise<ModuleInstance | null> {
    // Try built-in first
    let instance = await this.loaders.builtIn.load(id);
    if (instance) return instance;

    // Try npm
    instance = await this.loaders.npm.load(id);
    if (instance) return instance;

    // Try local path
    instance = await this.loaders.local.load(id);
    if (instance) return instance;

    return null;
  }

  async install(id: string, context: ProjectContext): Promise<InjectionResult> {
    const instance = await this.resolve(id);
    if (!instance) {
      return {
        success: false,
        modifiedFiles: [],
        installedDeps: [],
        messages: [],
        errors: [`Module "${id}" not found. Run "bliss list" to see available modules.`],
      };
    }

    const { meta, path } = instance;
    logger.step(`Installing module: ${meta.name}`);

    // Install dependencies
    const depsOk = installPackages(meta.dependencies, context, false);
    const devDepsOk = installPackages(meta.devDependencies, context, true);

    if (!depsOk || !devDepsOk) {
      return {
        success: false,
        modifiedFiles: [],
        installedDeps: [...meta.dependencies, ...meta.devDependencies],
        messages: [],
        errors: ["Failed to install dependencies"],
      };
    }

    // Inject files
    const result = injectModule(meta, path, context);
    result.installedDeps = [...meta.dependencies, ...meta.devDependencies];

    if (result.success) {
      addModuleToConfig(meta.id, context.cwd);
      this.registry.register(instance);
      logger.success(`Module ${meta.name} installed`);
    }

    return result;
  }

  async remove(id: string, context: ProjectContext): Promise<RemovalResult> {
    // Check if module is actually installed in config
    const config = loadConfig(context.cwd);
    if (!config || !config.modules.includes(id)) {
      return {
        success: false,
        restoredFiles: [],
        removedDeps: [],
        messages: [],
        errors: [`Module "${id}" is not installed. Run "bliss list" to see installed modules.`],
      };
    }

    const instance = await this.resolve(id);
    if (!instance) {
      // Module is in config but definition not found — just remove from config
      removeModuleFromConfig(id, context.cwd);
      return {
        success: true,
        restoredFiles: [],
        removedDeps: [],
        messages: [`Module "${id}" removed from config`],
        errors: [],
      };
    }

    const { meta } = instance;
    logger.step(`Removing module: ${meta.name}`);

    // Restore backups
    const backup = restoreModuleBackup(meta, context);

    // Uninstall dependencies (optional - could keep for other modules)
    // For now we don't auto-remove deps to avoid breaking other things

    removeModuleFromConfig(meta.id, context.cwd);

    const result: RemovalResult = {
      success: backup.success,
      restoredFiles: backup.restored,
      removedDeps: [],
      messages: [`Module ${meta.name} removed`],
      errors: backup.errors,
    };

    if (result.success) {
      logger.success(`Module ${meta.name} removed`);
    }

    return result;
  }

  async listAvailable(): Promise<ModuleMeta[]> {
    const builtIn = await this.loaders.builtIn.list();
    const npm = await this.loaders.npm.list();
    return [...builtIn, ...npm];
  }

  listInstalled(context: ProjectContext): string[] {
    return this.registry.installed(context);
  }
}

// Re-export for convenience
import type { ModuleInstance } from "../types/index.ts";
export { ModuleInstance };