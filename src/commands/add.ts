import { join } from "node:path";
import * as p from "@clack/prompts";
import { defineCommand } from "citty";
import {
  addFeature as addFeatureToConfig,
  hasConfig,
  loadConfig,
  updateEntryFile,
} from "../core/config.ts";
import { buildContext, detectEntryFile, validateEntryFile } from "../core/detector.ts";
import { getManualInstructions, injectFeature } from "../core/injector.ts";
import { installPackages } from "../core/installer.ts";
import { logger, setLogCwd } from "../core/logger.ts";
import { copyFeatureTemplate } from "../templates/engine.ts";
import { c } from "../utils/colors.ts";

const AVAILABLE_FEATURES = [
  { value: "logger", label: "Logger", hint: "Structured logging with Pino" },
  { value: "errors", label: "Error Handler", hint: "Centralized error handling" },
  { value: "env", label: "Env Config", hint: "Environment variables with Zod" },
  { value: "cors", label: "CORS", hint: "Cross-origin requests" },
  { value: "security", label: "Security", hint: "Helmet, rate-limiting, sanitization" },
  { value: "performance", label: "Performance", hint: "Compression, caching" },
  { value: "auth", label: "Auth", hint: "JWT authentication" },
];

export default defineCommand({
  meta: {
    name: "add",
    description: "Inject a feature module into your project",
  },
  args: {
    feature: {
      type: "positional",
      description: "Feature name",
      required: false,
    },
  },
  async run({ args }) {
    p.intro(c.bold("➕ Bliss Add — Install a feature"));
    const cwd = process.cwd();
    setLogCwd(cwd);


    if (!hasConfig(cwd)) {
      p.cancel("No bliss config found. Run 'bliss init' first.");
      return;
    }

    const config = loadConfig(cwd);
    if (!config) {
      p.cancel("Failed to load config");
      return;
    }

    // Select feature
    let featureId = args.feature;
    if (!featureId) {
      const installed = config.features;
      const options = AVAILABLE_FEATURES.map((f) => ({
        ...f,
        label: installed.includes(f.value) ? `${f.label} (installed)` : f.label,
      }));

      featureId = (await p.select({
        message: "Which feature to add?",
        options,
      })) as string;
    }

    if (p.isCancel(featureId)) {
      p.cancel("Cancelled");
      return;
    }

    // Check if already installed
    if (config.features.includes(featureId)) {
      const reinstall = await p.confirm({
        message: `"${featureId}" is already installed. Reinstall?`,
        initialValue: false,
      });
      if (!reinstall) {
        p.cancel("Skipped");
        return;
      }
    }

    const s = p.spinner();
    s.start(`Adding ${featureId}...`);

    // 1. Copy template files
    const copyOk = copyFeatureTemplate(featureId, cwd, config.project.language);
    if (!copyOk) {
      s.stop(c.error("Failed"));
      p.cancel(`Failed to copy ${featureId} files`);
      return;
    }

    // 2. Install dependencies
    const framework = config.project.framework;
    const pm = config.packageManager;

    const featureDeps: Record<string, { runtime: string[]; dev: string[] }> = {
      logger: { runtime: ["pino", "pino-pretty"], dev: ["@types/pino"] },
      errors: { runtime: [], dev: [] },
      env: { runtime: ["dotenv", "zod"], dev: [] },
      cors: { runtime: framework === "fastify" ? ["@fastify/cors"] : ["cors"], dev: [] },
      security: {
        runtime: ["helmet", "express-rate-limit", "express-mongo-sanitize", "hpp"],
        dev: [],
      },
      performance: { runtime: ["compression"], dev: [] },
      auth: {
        runtime: ["jsonwebtoken", "bcryptjs"],
        dev: ["@types/jsonwebtoken", "@types/bcryptjs"],
      },
    };

    const deps = featureDeps[featureId];
    if (deps) {
      if (deps.runtime.length > 0) installPackages(deps.runtime, pm, cwd, false);
      if (deps.dev.length > 0) installPackages(deps.dev, pm, cwd, true);
    }

    // 3. Auto-inject into entry file
    let entryFile = config.project.entryFile;
    const entryPath = join(cwd, entryFile);

    // Validate entry file exists and matches framework
    if (!validateEntryFile(entryPath, framework)) {
      // Try to detect entry file again
      const detected = detectEntryFile(cwd, framework);
      if (detected) {
        entryFile = detected;
        updateEntryFile(entryFile, cwd);
      } else {
        // Ask user
        s.stop(c.warning("Entry file not found"));
        const manualEntry = (await p.text({
          message: "Entry file path? (e.g., src/app.ts)",
          defaultValue: "src/index.ts",
        })) as string;

        if (!p.isCancel(manualEntry)) {
          entryFile = manualEntry;
          updateEntryFile(entryFile, cwd);
        }
      }
    }

    const injectResult = injectFeature(
      join(cwd, entryFile),
      featureId,
      framework,
      config.project.language === "typescript",
    );

    // 4. Update config
    addFeatureToConfig(featureId, cwd);

    s.stop(c.success(`Feature "${featureId}" added`));

    if (injectResult.manualInstructions) {
      console.log(c.warning("\n⚠ Auto-injection failed. Add manually:\n"));
      console.log(c.dim(injectResult.manualInstructions));
    }

    p.outro(c.success("Done!"));
  },
});
