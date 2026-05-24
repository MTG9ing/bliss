import type { Framework } from "./framework.ts";

export interface ModuleMeta {
  id: string;
  name: string;
  description: string;
  version: string;
  author?: string;
  tags: string[];
  frameworks: Framework[];
  dependencies: string[];
  devDependencies: string[];
  files: string[];
  postInstall?: string[];
}

export interface ModuleInstance {
  meta: ModuleMeta;
  source: "built-in" | "npm" | "local";
  path: string;
  loadedAt: Date;
}

export interface InjectionResult {
  success: boolean;
  modifiedFiles: string[];
  installedDeps: string[];
  messages: string[];
  errors: string[];
}

export interface RemovalResult {
  success: boolean;
  restoredFiles: string[];
  removedDeps: string[];
  messages: string[];
  errors: string[];
}