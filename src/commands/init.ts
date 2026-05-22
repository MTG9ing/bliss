import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import yocto from "yoctocolors";
import { writeFile, readFile, access } from "node:fs/promises";
import { join } from "node:path";

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export default defineCommand({
  meta: {
    name: "init",
    description: "Analyze workspace and generate custom bliss.json configuration",
  },
  async run() {
    p.intro(yocto.bgMagenta(yocto.black(" bliss init ")));

    const s = p.spinner();
    s.start("Analyzing your repository architecture...");

    // ==========================================
    // 1. ADVANCED AUTOMATED SCANS
    // ==========================================
    
    // Detect Root Directory Strategy (src vs source vs root)
    let baseDir = "";
    if (await fileExists(join(process.cwd(), "src"))) baseDir = "src";
    else if (await fileExists(join(process.cwd(), "source"))) baseDir = "source";

    // Detect Language
    const isTypeScript = await fileExists(join(process.cwd(), "tsconfig.json"));
    const extension = isTypeScript ? "ts" : "js";
    
    // Detect Package Manager
    let detectedPM = "npm";
    if (await fileExists(join(process.cwd(), "bun.lock"))) detectedPM = "bun";
    else if (await fileExists(join(process.cwd(), "pnpm-lock.yaml"))) detectedPM = "pnpm";
    else if (await fileExists(join(process.cwd(), "yarn.lock"))) detectedPM = "yarn";

    // Detect Framework & ORM
    let detectedFramework = "unknown";
    let detectedORM = "none";
    
    if (await fileExists(join(process.cwd(), "package.json"))) {
      try {
        const pkg = JSON.parse(await readFile(join(process.cwd(), "package.json"), "utf-8"));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        
        if (deps["express"]) detectedFramework = "express";
        else if (deps["fastify"]) detectedFramework = "fastify";
        
        if (deps["@prisma/client"] || deps["prisma"]) detectedORM = "prisma";
        else if (deps["mongoose"]) detectedORM = "mongoose";
      } catch {}
    }

    // Smart-calculate cleanest default entry point path based on findings
    const defaultEntry = baseDir 
      ? `${baseDir}/index.${extension}` 
      : `index.${extension}`;

    await new Promise((resolve) => setTimeout(resolve, 600));
    s.stop("Repository analysis complete.");

    // ==========================================
    // 2. ADAPTIVE INTERVIEW PROMPTS
    // ==========================================
    const projectSetup = await p.group({
      // Only asks to clarify framework if auto-detection comes up empty
      framework: () => detectedFramework === "unknown" 
        ? p.select({
            message: "We couldn't detect a framework. Which one are you using?",
            options: [
              { value: "express", label: "Express" },
              { value: "fastify", label: "Fastify" },
              { value: "none", label: "Vanilla Node.js HTTP (No Framework)" }
            ]
          })
        : Promise.resolve(detectedFramework),

      packageManager: () => p.select({
        message: `Confirm your package manager (We detected: ${yocto.bold(detectedPM)}):`,
        options: [
          { value: "bun", label: "Bun" },
          { value: "npm", label: "NPM" },
          { value: "pnpm", label: "PNPM" },
          { value: "yarn", label: "Yarn" },
        ],
        initialValue: detectedPM
      }),

      entryPoint: () => p.text({
        message: "Where is your main application entry point located?",
        placeholder: defaultEntry,
        defaultValue: defaultEntry
      }),

      databaseEngine: () => p.select({
        message: "Which core Database engine are you running?",
        options: [
          { value: "postgresql", label: "PostgreSQL" },
          { value: "mongodb", label: "MongoDB" },
          { value: "mysql", label: "MySQL" },
          { value: "sqlite", label: "SQLite" },
          { value: "none", label: "No Database Engine" },
        ]
      }),

      upgradeEnv: () => p.confirm({
        message: "Would you like Bliss to configure a centralized, type-safe environment loader configuration?",
        initialValue: true
      })
    });

    // ==========================================
    // 3. COMPILE DATA AND WRITE SCHEMA
    // ==========================================
    
    // Dynamically align output directories with the user's project layout
    const utilsPath = baseDir ? `${baseDir}/utils` : "utils";
    const envConfigPath = projectSetup.upgradeEnv
      ? (baseDir ? `${baseDir}/configurations/env.${extension}` : `configurations/env.${extension}`)
      : ".env";

    const blissConfig = {
      $schema: "https://bliss.dev/schema.json",
      language: isTypeScript ? "typescript" : "javascript",
      packageManager: projectSetup.packageManager,
      architecture: {
        framework: projectSetup.framework,
        orm: detectedORM,
        databaseEngine: projectSetup.databaseEngine
      },
      paths: {
        entryPoint: projectSetup.entryPoint,
        utilsDir: utilsPath,
        envConfig: envConfigPath
      },
      upgrades: {
        centralizedEnv: projectSetup.upgradeEnv,
      },
      modulesInstalled: []
    };

    const targetPath = join(process.cwd(), "bliss.json");
    await writeFile(targetPath, JSON.stringify(blissConfig, null, 2), "utf-8");

    p.outro(yocto.green("✔ bliss.json generated with perfect structural insights!"));
  }
});