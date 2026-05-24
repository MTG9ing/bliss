import { copyFileSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import MagicString from "magic-string";
import type { ModuleMeta, InjectionResult, ProjectContext } from "../types/index.ts";
import { readFile, writeFile, fileExists, ensureDir } from "../utils/fs.ts";
import { moduleBackupPath } from "../utils/path.ts";
import { logger } from "./logger.ts";
import { getModuleContent } from "../modules/bundle.ts";

export function injectModule(
  meta: ModuleMeta,
  sourceDir: string,
  context: ProjectContext,
): InjectionResult {
  const result: InjectionResult = {
    success: true,
    modifiedFiles: [],
    installedDeps: [],
    messages: [],
    errors: [],
  };

  // Backup first
  const backupDir = moduleBackupPath(context.cwd, meta.id);
  ensureDir(backupDir);

  for (const file of meta.files) {
    // Try to get content from bundle first (for compiled binary)
    const bundlePath = sourceDir + "/" + file;
    const bundleContent = getModuleContent(bundlePath);
    
    // Fallback to filesystem (for dev mode)
    const srcPath = join(sourceDir, file);
    const hasBundle = bundleContent !== null;
    const hasFile = fileExists(srcPath);
    
    if (!hasBundle && !hasFile) {
      result.errors.push(`Source file not found: ${file} (tried bundle: ${bundlePath}, fs: ${srcPath})`);
      result.success = false;
      continue;
    }

    const destPath = join(context.cwd, file);

    // Backup existing file (only if it exists)
    if (fileExists(destPath)) {
      const backupPath = join(backupDir, file);
      ensureDir(dirname(backupPath));
      copyFileSync(destPath, backupPath);
      logger.debug(`Backed up ${file}`);
    }

    // Copy new file
    ensureDir(dirname(destPath));
    
    let content: string;
    if (hasBundle) {
      content = bundleContent;
    } else {
      const fileContent = readFile(srcPath);
      if (fileContent === null) {
        result.errors.push(`Failed to read: ${srcPath}`);
        result.success = false;
        continue;
      }
      content = fileContent;
    }

    // Simple template substitution
    const processed = processTemplate(content, context);
    writeFile(destPath, processed);
    result.modifiedFiles.push(file);
    logger.success(`Injected ${file}`);
  }

  result.messages.push(`Module ${meta.name} injected successfully`);
  return result;
}

export function restoreModuleBackup(
  meta: ModuleMeta,
  context: ProjectContext,
): { success: boolean; restored: string[]; errors: string[] } {
  const backupDir = moduleBackupPath(context.cwd, meta.id);
  const restored: string[] = [];
  const errors: string[] = [];

  if (!existsSync(backupDir)) {
    // No backup exists — just delete the injected files
    logger.warn(`No backup found for ${meta.id}, deleting injected files instead`);
    for (const file of meta.files) {
      const destPath = join(context.cwd, file);
      if (fileExists(destPath)) {
        try {
          unlinkSync(destPath);
          restored.push(file);
        } catch {
          errors.push(`Failed to delete ${file}`);
        }
      }
    }
    return {
      success: errors.length === 0,
      restored,
      errors,
    };
  }

  for (const file of meta.files) {
    const backupPath = join(backupDir, file);
    const destPath = join(context.cwd, file);

    if (!fileExists(backupPath)) {
      // No backup for this file — delete the injected one
      if (fileExists(destPath)) {
        try {
          unlinkSync(destPath);
          restored.push(file);
        } catch {
          errors.push(`Failed to delete ${file}`);
        }
      }
      continue;
    }

    try {
      copyFileSync(backupPath, destPath);
      restored.push(file);
    } catch {
      errors.push(`Failed to restore ${file}`);
    }
  }

  return {
    success: errors.length === 0,
    restored,
    errors,
  };
}

function processTemplate(content: string, context: ProjectContext): string {
  return content
    .replace(/\{\{framework\}\}/g, context.framework)
    .replace(/\{\{language\}\}/g, context.language)
    .replace(/\{\{port\}\}/g, "3000");
}

export function appendToFile(filePath: string, code: string, anchor?: string): boolean {
  const content = readFile(filePath);
  if (!content) return false;

  const s = new MagicString(content);

  if (anchor && content.includes(anchor)) {
    const index = content.indexOf(anchor) + anchor.length;
    s.appendLeft(index, `\\n${code}\\n`);
  } else {
    s.append(`\\n${code}\\n`);
  }

  return writeFile(filePath, s.toString());
}