import type { ModuleMeta, ModuleInstance, InjectionResult, RemovalResult, ProjectContext } from "../types/index.ts";

export interface ModuleLoader {
  load(id: string): Promise<ModuleInstance | null>;
  list(): Promise<ModuleMeta[]>;
}

export interface ModuleRegistry {
  register(instance: ModuleInstance): void;
  get(id: string): ModuleInstance | undefined;
  list(): ModuleInstance[];
  installed(context: ProjectContext): string[];
}

export interface IModuleManager {
  install(id: string, context: ProjectContext): Promise<InjectionResult>;
  remove(id: string, context: ProjectContext): Promise<RemovalResult>;
  listAvailable(): Promise<ModuleMeta[]>;
  listInstalled(context: ProjectContext): string[];
}