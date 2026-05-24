import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { buildContext } from "../core/detector.ts";
import { hasConfig, loadConfig } from "../core/config.ts";
import { ModuleManager } from "../modules/manager.ts";
import { c } from "../utils/colors.ts";

export default defineCommand({
  meta: {
    name: "remove",
    description: "Remove an injected module",
  },
  args: {
    module: {
      type: "positional",
      description: "Module name",
      required: false,
    },
  },
  async run({ args }) {
    p.intro(c.bold("➖ Bliss Remove — Uninstall a module"));

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

    let moduleId = args.module;
    if (!moduleId) {
      moduleId = (await p.select({
        message: "Which module to remove?",
        options: config.modules.map((m) => ({ value: m, label: m })),
      })) as string;
    }

    if (p.isCancel(moduleId)) {
      p.cancel("Cancelled");
      return;
    }

    if (!config.modules.includes(moduleId)) {
      p.cancel(`Module "${moduleId}" is not installed.`);
      return;
    }

    const confirm = await p.confirm({
      message: `Remove "${moduleId}"? This will restore backed-up files.`,
      initialValue: false,
    });

    if (!confirm || p.isCancel(confirm)) {
      p.cancel("Cancelled");
      return;
    }

    const s = p.spinner();
    s.start(`Removing ${moduleId}...`);

    const result = await manager.remove(moduleId, context);

    if (result.success) {
      s.stop(c.success(`Module "${moduleId}" removed`));
    } else {
      s.stop(c.error(`Failed to remove "${moduleId}"`));
      for (const err of result.errors) console.log(c.error(`  ✖ ${err}`));
    }

    p.outro(result.success ? c.success("Done!") : c.error("Failed"));
  },
});