import type { ModuleInstance, ModuleMeta, ProjectContext } from "../types/index.ts";
import { loadConfig } from "../core/config.ts";
import type { ModuleRegistry } from "./types.ts";

export class InMemoryRegistry implements ModuleRegistry {
  private modules = new Map<string, ModuleInstance>();

  register(instance: ModuleInstance): void {
    this.modules.set(instance.meta.id, instance);
  }

  get(id: string): ModuleInstance | undefined {
    return this.modules.get(id);
  }

  list(): ModuleInstance[] {
    return Array.from(this.modules.values());
  }

  installed(context: ProjectContext): string[] {
    const config = loadConfig(context.cwd);
    return config?.modules ?? [];
  }
}