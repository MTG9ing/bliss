import { readFile } from "node:fs/promises";
import { join } from "node:path";

export type Framework = "express" | "fastify" | "unknown";

export async function detectFramework(projectPath: string = process.cwd()): Promise<Framework> {
  try {
    // 1. Locate the package.json path of the project we are modifying
    const packageJsonPath = join(projectPath, "package.json");

    // 2. Read the file buffer and parse it into an active JavaScript object
    const rawContent = await readFile(packageJsonPath, "utf-8");
    const pkg = JSON.parse(rawContent);

    // 3. Extract all dependencies to scan for target backend frameworks
    const dependencies = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    // 4. Evaluation logic
    if (dependencies["express"]) return "express";
    if (dependencies["fastify"]) return "fastify";

    return "unknown";
  } catch (error) {
    // If package.json doesn't exist, handle it safely without crashing the CLI
    return "unknown";
  }
}