import { existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import * as p from "@clack/prompts";
import { defineCommand } from "citty";
import { createConfig, saveConfig } from "../core/config.ts";
import { detectPackageManager } from "../core/detector.ts";
import { installPackages } from "../core/installer.ts";
import { logger, setLogCwd } from "../core/logger.ts";
import { scaffoldProject } from "../templates/engine.ts";
import type { Framework, Language, PackageManager } from "../types/framework.ts";
import { FRAMEWORK_META, FRAMEWORKS } from "../types/framework.ts";
import { c } from "../utils/colors.ts";
import { readJson } from "../utils/fs.ts";

export default defineCommand({
  meta: {
    name: "create",
    description: "Scaffold a new project from template",
  },
  args: {
    name: {
      type: "positional",
      description: "Project name",
      required: false,
    },
    framework: {
      type: "string",
      description: "Framework to use",
      alias: "f",
    },
    language: {
      type: "string",
      description: "Language (typescript or javascript)",
      alias: "l",
    },
    minimal: {
      type: "boolean",
      description: "Minimal setup (no features)",
      default: false,
    },
  },
  async run({ args }) {
    p.intro(c.bold("🚀 Bliss Create — Scaffold a new project"));

    // Project name
    let projectName = args.name;
    if (!projectName) {
      projectName = (await p.text({
        message: "Project name?",
        placeholder: "my-awesome-api",
        validate: (value) => {
          if (!value) return "Name is required";
          if (!/^[a-z0-9-]+$/.test(value)) return "Use lowercase, numbers, hyphens";
        },
      })) as string;
    }

    if (p.isCancel(projectName)) {
      p.cancel("Cancelled");
      return;
    }

    const targetDir = resolve(projectName);
    if (existsSync(targetDir)) {
      p.cancel(`Directory "${projectName}" already exists`);
      return;
    }

    // Framework
    let framework = args.framework as Framework;
    if (!framework || !FRAMEWORKS.includes(framework)) {
      framework = (await p.select({
        message: "Which framework?",
        options: FRAMEWORKS.map((f) => ({
          value: f,
          label: FRAMEWORK_META[f].displayName,
        })),
      })) as Framework;
    }

    if (p.isCancel(framework)) {
      p.cancel("Cancelled");
      return;
    }

    // Language
    let language = args.language as Language;
    if (!language) {
      language = (await p.select({
        message: "Which language?",
        options: [
          { value: "typescript", label: "TypeScript" },
          { value: "javascript", label: "JavaScript" },
        ],
      })) as Language;
    }

    if (p.isCancel(language)) {
      p.cancel("Cancelled");
      return;
    }

    // Package manager
    const detectedPm = detectPackageManager(process.cwd());
    const packageManager = (await p.select({
      message: "Package manager?",
      options: [
        { value: "bun", label: "Bun (recommended)" },
        { value: "npm", label: "npm" },
        { value: "pnpm", label: "pnpm" },
        { value: "yarn", label: "yarn" },
      ],
      initialValue: detectedPm,
    })) as PackageManager;

    if (p.isCancel(packageManager)) {
      p.cancel("Cancelled");
      return;
    }

    // Features (if not minimal)
    let features: string[] = [];
    if (!args.minimal) {
      const featureChoices = await p.multiselect({
        message: "Select features (space to toggle, enter to confirm):",
        options: [
          { value: "logger", label: "Logger", hint: "Structured logging with Pino" },
          { value: "errors", label: "Error Handler", hint: "Centralized error handling" },
          { value: "env", label: "Env Config", hint: "Environment variables with Zod" },
          { value: "cors", label: "CORS", hint: "Cross-origin requests" },
          { value: "security", label: "Security", hint: "Helmet, rate-limiting, sanitization" },
          { value: "performance", label: "Performance", hint: "Compression, caching" },
          { value: "auth", label: "Auth", hint: "JWT authentication" },
        ],
      });

      if (!p.isCancel(featureChoices)) {
        features = featureChoices as string[];
      }
    }

    // Git init
    const includeGit = await p.confirm({
      message: "Initialize git repository?",
      initialValue: true,
    });

    if (p.isCancel(includeGit)) {
      p.cancel("Cancelled");
      return;
    }

    // Tests
    const includeTests = await p.confirm({
      message: "Include test setup (Vitest)?",
      initialValue: true,
    });

    if (p.isCancel(includeTests)) {
      p.cancel("Cancelled");
      return;
    }

    // Scaffold
    const s = p.spinner();
    s.start("Creating project...");

    mkdirSync(targetDir, { recursive: true });

    const context = {
      projectName,
      framework,
      language,
      packageManager,
      features,
      includeTests,
      includeGit,
    };

    // Set log directory to target project
    setLogCwd(targetDir);

    scaffoldProject(targetDir, context);

    // Save config
    const config = createConfig(projectName, "backend", framework, language, packageManager);
    config.features = features;
    config.git.initialized = includeGit;
    saveConfig(config, targetDir);

    // Git init
    if (includeGit) {
      try {
        const { execSync } = await import("node:child_process");
        execSync("git init", { cwd: targetDir, stdio: "ignore" });
        execSync("git add .", { cwd: targetDir, stdio: "ignore" });
        execSync('git commit -m "Initial commit"', { cwd: targetDir, stdio: "ignore" });
      } catch {
        logger.warn("Git init failed, continuing...");
      }
    }

    // Install dependencies
    s.message("Installing dependencies...");
    const pkgPath = join(targetDir, "package.json");
    const pkg = readJson<Record<string, unknown>>(pkgPath);
    const deps = Object.keys((pkg?.dependencies as Record<string, unknown>) || {});
    const devDeps = Object.keys((pkg?.devDependencies as Record<string, unknown>) || {});

    if (deps.length > 0) installPackages(deps, packageManager, targetDir, false);
    if (devDeps.length > 0) installPackages(devDeps, packageManager, targetDir, true);

    s.stop(c.success("Project ready!"));

    p.outro(c.success(`✨ Project "${projectName}" created!`));
    console.log(c.dim(`\n  cd ${projectName}`));
    console.log(c.dim(`  ${packageManager} run dev\n`));
  },
});
