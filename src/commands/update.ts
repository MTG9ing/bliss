import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { hasConfig, loadConfig } from "../core/config.ts";
import { buildContext } from "../core/detector.ts";
import { ModuleManager } from "../modules/manager.ts";
import { c } from "../utils/colors.ts";

export default defineCommand({
  meta: {
    name: "update",
    description: "Update a module to latest version",
  },
  args: {
    module: {
      type: "positional",
      description: "Module name (or 'all')",
      required: false,
    },
  },
  async run({ args }) {
    p.intro(c.bold("🔄 Bliss Update — Update modules"));

    const cwd = process.cwd();
    if (!hasConfig(cwd)) {
      p.cancel("No bliss.config.json found.");
      return;
    }

    const config = loadConfig(cwd);
    if (!config || config.modules.length === 0) {
      p.cancel("No modules installed.");
      return;
    }

    const manager = new ModuleManager();
    const context = buildContext(cwd);

    let target = args.module;
    if (!target) {
      target = (await p.select({
        message: "Which module to update?",
        options: [
          { value: "all", label: "All modules" },
          ...config.modules.map((m) => ({ value: m, label: m })),
        ],
      })) as string;
    }

    if (p.isCancel(target)) {
      p.cancel("Cancelled");
      return;
    }

    const toUpdate = target === "all" ? config.modules : [target];
    const s = p.spinner();

    for (const mod of toUpdate) {
      s.start(`Updating ${mod}...`);

      // Remove then reinstall
      await manager.remove(mod, context);
      const result = await manager.install(mod, context);

      if (result.success) {
        s.stop(c.success(`Updated ${mod}`));
      } else {
        s.stop(c.error(`Failed to update ${mod}`));
      }
    }

    p.outro(c.success("Done!"));
  },
});