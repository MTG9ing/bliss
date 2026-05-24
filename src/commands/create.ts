import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { Framework } from "../types/framework.ts";
import { FRAMEWORKS, FRAMEWORK_META } from "../types/framework.ts";
import { buildContext, detectPackageManager } from "../core/detector.ts";
import { createConfig, saveConfig } from "../core/config.ts";
import { installPackages } from "../core/installer.ts";
import { scaffoldFromTemplate, buildTemplateContext } from "../templates/engine.ts";
import { logger } from "../core/logger.ts";

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
    skipInstall: {
      type: "boolean",
      description: "Skip dependency installation",
      default: false,
    },
  },
  async run({ args }) {
    p.intro("🚀 Bliss Create — Scaffold a new project");

    let projectName = args.name;
    if (!projectName) {
      projectName = (await p.text({
        message: "Project name?",
        placeholder: "my-awesome-api",
        validate: (value) => {
          if (!value) return "Name is required";
          if (!/^[a-z0-9-]+$/.test(value)) return "Use lowercase letters, numbers, and hyphens";
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

    let language = args.language as "typescript" | "javascript";
    if (!language) {
      language = (await p.select({
        message: "Which language?",
        options: [
          { value: "typescript", label: "TypeScript" },
          { value: "javascript", label: "JavaScript" },
        ],
      })) as "typescript" | "javascript";
    }

    if (p.isCancel(language)) {
      p.cancel("Cancelled");
      return;
    }

    const features = await p.group({
      eslint: () => p.confirm({ message: "Add ESLint?", initialValue: true }),
      prettier: () => p.confirm({ message: "Add Prettier?", initialValue: true }),
      docker: () => p.confirm({ message: "Add Dockerfile?", initialValue: false }),
      tests: () => p.confirm({ message: "Add test setup (Vitest)?", initialValue: true }),
    });

    if (Object.values(features).some((v) => p.isCancel(v))) {
      p.cancel("Cancelled");
      return;
    }

    const s = p.spinner();
    s.start("Creating project...");

    mkdirSync(targetDir, { recursive: true });

    const context = {
      cwd: targetDir,
      framework,
      language,
      hasTypeScript: language === "typescript",
      packageManager: detectPackageManager(process.cwd()),
    };

    const templateData = buildTemplateContext(projectName, context, {
      eslint: features.eslint,
      prettier: features.prettier,
      docker: features.docker,
      tests: features.tests,
    });

    // Use bundle-based template rendering (works with --compile)
    scaffoldFromTemplate("base", targetDir, templateData);
    scaffoldFromTemplate("frameworks/" + framework, join(targetDir, "src"), templateData);

    const config = createConfig(framework, language, {
      features: {
        eslint: features.eslint,
        prettier: features.prettier,
        docker: features.docker,
        tests: features.tests,
      },
    });
    saveConfig(config, targetDir);

    s.stop("Project files created");

    if (!args.skipInstall) {
      s.start("Installing dependencies...");
      const pkgPath = join(targetDir, "package.json");
      
      // Read the generated package.json from template with safety net
      let pkg: Record<string, unknown>;
      try {
        const raw = readFileSync(pkgPath, "utf-8");
        pkg = JSON.parse(raw);
      } catch (e) {
        s.stop("Failed");
        p.cancel(`Generated invalid package.json: ${(e as Error).message}`);
        return;
      }
      
      // Modify based on features
      if (!features.eslint) {
        delete (pkg.scripts as Record<string, unknown>)?.lint;
        delete (pkg.devDependencies as Record<string, unknown>)?.eslint;
      }
      if (!features.prettier) {
        delete (pkg.scripts as Record<string, unknown>)?.format;
        delete (pkg.devDependencies as Record<string, unknown>)?.prettier;
      }
      if (!features.tests) {
        delete (pkg.scripts as Record<string, unknown>)?.test;
        delete (pkg.devDependencies as Record<string, unknown>)?.vitest;
      }
      if (language === "javascript") {
        delete (pkg.devDependencies as Record<string, unknown>)?.typescript;
        delete (pkg.devDependencies as Record<string, unknown>)?.["@types/node"];
        delete (pkg.devDependencies as Record<string, unknown>)?.["@types/express"];
        pkg.main = "src/index.js";
        (pkg.scripts as Record<string, unknown>).dev = `${context.packageManager} run dev`;
        (pkg.scripts as Record<string, unknown>).build = "echo 'No build step needed'";
      }
      
      // Clean up undefined/null devDependencies
      if (pkg.devDependencies) {
        pkg.devDependencies = Object.fromEntries(
          Object.entries(pkg.devDependencies as Record<string, unknown>).filter(([_, v]) => v != null)
        );
      }
      
      // Write normalized JSON (guaranteed valid)
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      
      const deps = Object.keys((pkg.dependencies as Record<string, unknown>) || {});
      const devDeps = Object.keys((pkg.devDependencies as Record<string, unknown>) || {});

      if (deps.length > 0) installPackages(deps, context, false);
      if (devDeps.length > 0) installPackages(devDeps, context, true);
      s.stop("Dependencies installed");
    }

    p.outro(`✨ Project "${projectName}" ready!`);
    console.log(`\\n  cd ${projectName}`);
    console.log(`  ${context.packageManager} run dev\\n`);
  },
});