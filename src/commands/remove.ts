import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { join } from "node:path";
import { hasConfig, loadConfig, removeFeature as removeFeatureFromConfig } from "../core/config.ts";
import { removeFeatureInjection } from "../core/injector.ts";
import { uninstallPackages } from "../core/installer.ts";
import { logger } from "../core/logger.ts";
import { c } from "../utils/colors.ts";

export default defineCommand({
  meta: {
    name: "remove",
    description: "Remove an injected feature module",
  },
  args: {
    feature: {
      type: "positional",
      description: "Feature name",
      required: false,
    },
  },
  async run({ args }) {
    p.intro(c.bold("➖ Bliss Remove — Uninstall a feature"));

    const cwd = process.cwd();

    if (!hasConfig(cwd)) {
      p.cancel("No bliss config found.");
      return;
    }

    const config = loadConfig(cwd);
    if (!config || config.features.length === 0) {
      p.cancel("No features installed.");
      return;
    }

    let featureId = args.feature;
    if (!featureId) {
      featureId = (await p.select({
        message: "Which feature to remove?",
        options: config.features.map((f) => ({ value: f, label: f })),
      })) as string;
    }

    if (p.isCancel(featureId)) {
      p.cancel("Cancelled");
      return;
    }

    if (!config.features.includes(featureId)) {
      p.cancel(`Feature "${featureId}" is not installed.`);
      return;
    }

    const confirm = await p.confirm({
      message: `Remove "${featureId}"? This will clean up injected code.`,
      initialValue: false,
    });

    if (!confirm) {
      p.cancel("Cancelled");
      return;
    }

    const s = p.spinner();
    s.start(`Removing ${featureId}...`);

    // 1. Remove injection from entry file
    const entryPath = join(cwd, config.project.entryFile);
    removeFeatureInjection(entryPath, featureId, config.project.framework);

    // 2. Remove from config (we don't delete files to avoid breaking user code)
    removeFeatureFromConfig(featureId, cwd);

    // 3. Optionally uninstall deps (ask user)
    // For now, we keep deps to avoid breaking other things

    s.stop(c.success(`Feature "${featureId}" removed`));

    p.outro(c.success("Done!"));
    console.log(c.dim("\n  Note: Feature files remain in src/. Delete manually if needed.\n"));
  },
});
