import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Define the structural TypeScript interface matching our bliss.json schema
export interface BlissConfig {
  language: "typescript" | "javascript";
  packageManager: "bun" | "npm" | "pnpm" | "yarn";
  architecture: {
    framework: "express" | "fastify" | "none" | "unknown";
    orm: "prisma" | "mongoose" | "none";
    databaseEngine: "postgresql" | "mongodb" | "mysql" | "sqlite" | "none";
  };
  paths: {
    entryPoint: string;
    utilsDir: string;
    envConfig: string;
  };
  upgrades: {
    centralizedEnv: boolean;
  };
  modulesInstalled: string[];
}

export async function loadConfig(): Promise<BlissConfig | null> {
  try {
    const configPath = join(process.cwd(), "bliss.json");
    const rawContent = await readFile(configPath, "utf-8");
    return JSON.parse(rawContent) as BlissConfig;
  } catch {
    // Return null if the file doesn't exist or is corrupted JSON
    return null;
  }
}

export async function saveConfig(config: BlissConfig): Promise<boolean> {
  try {
    const configPath = join(process.cwd(), "bliss.json");
    await writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}