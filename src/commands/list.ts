import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { buildContext } from "../core/detector.ts";
import { hasConfig, loadConfig } from "../core/config.ts";
import { ModuleManager } from "../modules/manager.ts";
import { c } from "../utils/colors.ts";

export default defineCommand({
  meta: {
    name: "list",
    description: "List installed and available modules",
  },
  args: {
    available: {
      type: "boolean",
      description: "Show only available modules",
      default: false,
    },
    installed: {
      type: "boolean",
      description: "Show only installed modules",
      default: false,
    },
  },
  async run({ args }) {
    p.intro(c.bold("📋 Bliss List — Modules"));

    const cwd = process.cwd();
    const manager = new ModuleManager();
    const context = buildContext(cwd);

    const showInstalled = !args.available || args.installed;
    const showAvailable = !args.installed || args.available;

    // Installed modules
    if (showInstalled && hasConfig(cwd)) {
      const config = loadConfig(cwd);
      if (config && config.modules.length > 0) {
        console.log(c.info("\\nInstalled:"));
        for (const mod of config.modules) {
          console.log(`  ${c.success("●")} ${c.bold(mod)}`);
        }
      } else {
        console.log(c.dim("\\nNo modules installed."));
      }
    }

    // Available modules
    if (showAvailable) {
      const available = await manager.listAvailable();
      const installed = hasConfig(cwd) ? loadConfig(cwd)?.modules ?? [] : [];

      console.log(c.info("\\nAvailable:"));
      for (const mod of available) {
        const isInstalled = installed.includes(mod.id);
        const icon = isInstalled ? c.success("●") : c.dim("○");
        const name = isInstalled ? c.dim(mod.name) : c.bold(mod.name);
        console.log(`  ${icon} ${name} ${c.dim(mod.description)}`);
      }
    }

    p.outro(c.dim("\\nUse 'bliss add <module>' to install"));
  },
});