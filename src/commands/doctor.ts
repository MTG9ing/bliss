import { existsSync } from "node:fs";
import { join } from "node:path";
import * as p from "@clack/prompts";
import { defineCommand } from "citty";
import { hasConfig, loadConfig } from "../core/config.ts";
import { buildContext } from "../core/detector.ts";
import { logger } from "../core/logger.ts";
import { c } from "../utils/colors.ts";
import { fileExists, readJson } from "../utils/fs.ts";

interface HealthCheck {
  name: string;
  status: "pass" | "warn" | "fail";
  message: string;
  fix?: string;
}

export default defineCommand({
  meta: {
    name: "doctor",
    description: "Run health checks on your project",
  },
  args: {
    fix: {
      type: "boolean",
      description: "Attempt to fix issues automatically",
      default: false,
    },
  },
  async run({ args }) {
    p.intro(c.bold("🏥 Bliss Doctor — Project health check"));

    const cwd = process.cwd();
    const checks: HealthCheck[] = [];

    // Check 1: bliss config
    if (!hasConfig(cwd)) {
      checks.push({
        name: "Bliss Config",
        status: "fail",
        message: "No .bliss/config.json found",
        fix: "Run 'bliss init'",
      });
    } else {
      const config = loadConfig(cwd);
      if (config) {
        checks.push({
          name: "Bliss Config",
          status: "pass",
          message: `Config valid (v${config.version})`,
        });

        // Check features match installed packages
        const pkg = readJson<{ dependencies?: Record<string, string> }>(join(cwd, "package.json"));
        const featureDeps: Record<string, string[]> = {
          logger: ["pino"],
          env: ["dotenv", "zod"],
          cors: ["cors", "@fastify/cors"],
          security: ["helmet"],
          performance: ["compression"],
          auth: ["jsonwebtoken"],
        };

        for (const feature of config.features) {
          const deps = featureDeps[feature];
          if (deps && pkg?.dependencies) {
            const hasDep = deps.some((d) => d in pkg.dependencies!);
            if (!hasDep) {
              checks.push({
                name: `Feature: ${feature}`,
                status: "warn",
                message: `Dependencies missing for ${feature}`,
                fix: `Run 'bliss add ${feature}' to reinstall`,
              });
            }
          }
        }
      } else {
        checks.push({
          name: "Bliss Config",
          status: "fail",
          message: "Config file is invalid",
          fix: "Delete .bliss/config.json and run 'bliss init'",
        });
      }
    }

    // Check 2: package.json
    if (!fileExists(join(cwd, "package.json"))) {
      checks.push({
        name: "package.json",
        status: "fail",
        message: "No package.json found",
        fix: "Run 'npm init' or 'bliss init'",
      });
    } else {
      checks.push({ name: "package.json", status: "pass", message: "Found" });
    }

    // Check 3: node_modules
    if (!existsSync(join(cwd, "node_modules"))) {
      checks.push({
        name: "Dependencies",
        status: "warn",
        message: "node_modules not found",
        fix: "Run 'npm install' or 'bun install'",
      });
    } else {
      checks.push({ name: "Dependencies", status: "pass", message: "Installed" });
    }

    // Check 4: Entry file
    const context = buildContext(cwd);
    if (context.entryFile) {
      checks.push({
        name: "Entry File",
        status: "pass",
        message: `Found: ${context.entryFile}`,
      });
    } else {
      checks.push({
        name: "Entry File",
        status: "warn",
        message: "Entry file not detected",
        fix: "Check .bliss/config.json or run 'bliss init'",
      });
    }

    // Check 5: Git
    if (existsSync(join(cwd, ".git"))) {
      checks.push({ name: "Git", status: "pass", message: "Repository initialized" });
    } else {
      checks.push({
        name: "Git",
        status: "warn",
        message: "Not a git repository",
        fix: "Run 'git init' or 'bliss git init'",
      });
    }

    // Print results
    console.log("");
    for (const check of checks) {
      const icon =
        check.status === "pass"
          ? c.success("✔")
          : check.status === "warn"
            ? c.warning("⚠")
            : c.error("✖");
      const color =
        check.status === "pass" ? c.success : check.status === "warn" ? c.warning : c.error;
      console.log(`${icon} ${color(check.name)}: ${check.message}`);
      if (check.fix) {
        console.log(c.dim(`  → Fix: ${check.fix}`));
      }
    }

    const failures = checks.filter((c) => c.status === "fail").length;
    const warnings = checks.filter((c) => c.status === "warn").length;

    if (failures === 0 && warnings === 0) {
      p.outro(c.success("✨ All checks passed!"));
    } else if (failures === 0) {
      p.outro(c.warning(`⚠ ${warnings} warning${warnings > 1 ? "s" : ""} found`));
    } else {
      p.outro(
        c.error(
          `✖ ${failures} failure${failures > 1 ? "s" : ""}, ${warnings} warning${warnings > 1 ? "s" : ""}`,
        ),
      );
    }
  },
});
