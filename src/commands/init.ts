import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { buildContext, detectFramework, detectLanguage, detectPackageManager } from "../core/detector.ts";
import { createConfig, saveConfig, hasConfig, loadConfig } from "../core/config.ts";
import { scaffoldProject } from "../templates/engine.ts";
import { logger } from "../core/logger.ts";
import { c } from "../utils/colors.ts";
import type { Framework, Language, PackageManager, ProjectType } from "../types/framework.ts";
import { FRAMEWORKS, FRAMEWORK_META } from "../types/framework.ts";

export default defineCommand({
  meta: {
    name: "init",
    description: "Configure or bootstrap current directory",
  },
  args: {
    force: {
      type: "boolean",
      description: "Overwrite existing config",
      default: false,
    },
  },
  async run({ args }) {
    p.intro(c.bold("🔧 Bliss Init"));

    const cwd = process.cwd();
    const isEmpty = readdirSync(cwd).length === 0;

    // Empty directory → offer full scaffold
    if (isEmpty) {
      const scaffold = await p.confirm({
        message: "This directory is empty. Create a new project here?",
        initialValue: true,
      });

      if (scaffold) {
        // Delegate to create flow but in current directory
        const projectName = (await p.text({
          message: "Project name?",
          placeholder: "my-project",
          validate: (v) => !v ? "Name required" : undefined,
        })) as string;

        if (p.isCancel(projectName)) {
          p.cancel("Cancelled");
          return;
        }

        const framework = (await p.select({
          message: "Framework?",
          options: FRAMEWORKS.map((f) => ({
            value: f,
            label: FRAMEWORK_META[f].displayName,
          })),
        })) as Framework;

        const language = (await p.select({
          message: "Language?",
          options: [
            { value: "typescript", label: "TypeScript" },
            { value: "javascript", label: "JavaScript" },
          ],
        })) as Language;

        const packageManager = detectPackageManager(cwd);

        const features = (await p.multiselect({
          message: "Features?",
          options: [
            { value: "logger", label: "Logger" },
            { value: "errors", label: "Error Handler" },
            { value: "env", label: "Env Config" },
            { value: "cors", label: "CORS" },
            { value: "security", label: "Security" },
            { value: "performance", label: "Performance" },
            { value: "auth", label: "Auth" },
          ],
        })) as string[];

        const context = {
          projectName,
          framework,
          language,
          packageManager,
          features: Array.isArray(features) ? features : [],
          includeTests: true,
          includeGit: true,
        };

        const s = p.spinner();
        s.start("Scaffolding...");

        scaffoldProject(cwd, context);

        const config = createConfig(projectName, "backend", framework, language, packageManager);
        config.features = context.features;
        saveConfig(config, cwd);

        s.stop(c.success("Done!"));
        p.outro(c.success("✨ Project initialized!"));
        return;
      }
    }

    // Existing project → configure
    if (hasConfig(cwd) && !args.force) {
      const existing = loadConfig(cwd);
      const overwrite = await p.confirm({
        message: `bliss config exists (${existing?.project.framework}). Overwrite?`,
        initialValue: false,
      });
      if (!overwrite) {
        p.cancel("Keeping existing config");
        return;
      }
    }

    const s = p.spinner();
    s.start("Analyzing project...");

    const context = buildContext(cwd);
    s.stop("Analysis complete");

    console.log(c.info("\nDetected:"));
    console.log(`  Framework: ${c.bold(context.framework)}`);
    console.log(`  Language: ${c.bold(context.language)}`);
    console.log(`  Package Manager: ${c.bold(context.packageManager)}`);

    // Confirm framework
    const confirmFw = await p.confirm({
      message: `Framework "${context.framework}" detected. Is this correct?`,
      initialValue: true,
    });

    if (!confirmFw) {
      const manualFw = (await p.select({
        message: "Select framework:",
        options: FRAMEWORKS.map((f) => ({ value: f, label: FRAMEWORK_META[f].displayName })),
      })) as Framework;
      context.framework = manualFw;
    }

    // Create config
    const projectName = (await p.text({
      message: "Project name?",
      defaultValue: context.framework + "-app",
    })) as string;

    const config = createConfig(
      projectName,
      "backend",
      context.framework,
      context.language,
      context.packageManager,
      context.entryFile || "src/index.ts"
    );

    saveConfig(config, cwd);

    p.outro(c.success("✨ Project configured!"));
    console.log(c.dim("\n  Run 'bliss add <feature>' to add features\n"));
  },
});
