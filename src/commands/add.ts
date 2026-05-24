import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { buildContext } from "../core/detector.ts";
import { hasConfig } from "../core/config.ts";
import { ModuleManager } from "../modules/manager.ts";
import { c } from "../utils/colors.ts";

export default defineCommand({
  meta: {
    name: "add",
    description: "Inject a module into your project",
  },
  args: {
    module: {
      type: "positional",
      description: "Module name or path",
      required: false,
    },
  },
  async run({ args }) {
    p.intro(c.bold("➕ Bliss Add — Install a module"));

    const cwd = process.cwd();
    if (!hasConfig(cwd)) {
      p.cancel("No bliss.config.json found. Run 'bliss init' first.");
      return;
    }

    const manager = new ModuleManager();
    const context = buildContext(cwd);

    // If no module specified, show interactive list
    let moduleId = args.module;
    if (!moduleId) {
      const available = await manager.listAvailable();
      const installed = manager.listInstalled(context);

      if (available.length === 0) {
        p.cancel("No modules available. Check your installation.");
        return;
      }

      const options = available.map((m) => ({
        value: m.id,
        label: `${m.name} ${installed.includes(m.id) ? "(installed)" : ""}`,
        hint: m.description,
      }));

      moduleId = (await p.select({
        message: "Which module to install?",
        options,
      })) as string;
    }

    if (p.isCancel(moduleId)) {
      p.cancel("Cancelled");
      return;
    }

    // Check if already installed
    const installed = manager.listInstalled(context);
    if (installed.includes(moduleId)) {
      const reinstall = await p.confirm({
        message: `Module "${moduleId}" is already installed. Reinstall?`,
        initialValue: false,
      });
      if (!reinstall || p.isCancel(reinstall)) {
        p.cancel("Skipped");
        return;
      }
    }

    const s = p.spinner();
    s.start(`Installing ${moduleId}...`);

    const result = await manager.install(moduleId, context);

    if (result.success) {
      s.stop(c.success(`Module "${moduleId}" installed`));
      if (result.messages.length > 0) {
        for (const msg of result.messages) console.log(c.dim(`  → ${msg}`));
      }
    } else {
      s.stop(c.error(`Failed to install "${moduleId}"`));
      for (const err of result.errors) console.log(c.error(`  ✖ ${err}`));
    }

    p.outro(result.success ? c.success("Done!") : c.error("Failed"));
  },
});