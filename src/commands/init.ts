import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { buildContext, detectFramework } from "../core/detector.ts";
import { createConfig, saveConfig, hasConfig, loadConfig } from "../core/config.ts";
import { runHealthChecks, printHealthChecks } from "../core/validator.ts";
import { c } from "../utils/colors.ts";

export default defineCommand({
  meta: {
    name: "init",
    description: "Analyze and configure an existing project",
  },
  args: {
    force: {
      type: "boolean",
      description: "Overwrite existing config",
      default: false,
    },
  },
  async run({ args }) {
    p.intro(c.bold("🔧 Bliss Init — Configure existing project"));

    const cwd = process.cwd();
    const pkgPath = join(cwd, "package.json");

    if (!existsSync(pkgPath)) {
      p.cancel("No package.json found. Run this in a Node.js project directory.");
      return;
    }

    // Check existing config
    if (hasConfig(cwd) && !args.force) {
      const existing = loadConfig(cwd);
      const overwrite = await p.confirm({
        message: `bliss.config.json already exists (framework: ${existing?.framework}). Overwrite?`,
        initialValue: false,
      });
      if (!overwrite || p.isCancel(overwrite)) {
        p.cancel("Keeping existing config");
        return;
      }
    }

    const s = p.spinner();
    s.start("Analyzing project...");

    const context = buildContext(cwd);
    s.stop("Analysis complete");

    // Show detected info
    console.log(c.info("\\nDetected:"));
    console.log(`  Framework: ${c.bold(context.framework)}`);
    console.log(`  Language: ${c.bold(context.language)}`);
    console.log(`  Package Manager: ${c.bold(context.packageManager)}`);

    // Framework confirmation
    const detectedFw = detectFramework(cwd);
    if (!detectedFw) {
      const confirmFw = await p.confirm({
        message: `Framework "${context.framework}" detected. Is this correct?`,
        initialValue: true,
      });
      if (!confirmFw || p.isCancel(confirmFw)) {
        p.cancel("Please specify framework manually or check your dependencies");
        return;
      }
    }

    // Run health checks
    s.start("Running health checks...");
    const checks = runHealthChecks(context);
    s.stop("Health checks complete");
    printHealthChecks(checks);

    // Create config
    const config = createConfig(context.framework, context.language);
    saveConfig(config, cwd);

    p.outro(c.success("✨ Project configured!"));
    console.log(c.dim("\\n  Run 'bliss add <module>' to add features\\n"));
  },
});