import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { buildContext } from "../core/detector.ts";
import { hasConfig } from "../core/config.ts";
import { runHealthChecks, printHealthChecks } from "../core/validator.ts";
import { c } from "../utils/colors.ts";

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
    if (!hasConfig(cwd)) {
      p.cancel("No bliss.config.json found. Run 'bliss init' first.");
      return;
    }

    const s = p.spinner();
    s.start("Running diagnostics...");

    const context = buildContext(cwd);
    const checks = runHealthChecks(context);

    s.stop("Diagnostics complete");
    printHealthChecks(checks);

    const failures = checks.filter((c) => c.status === "fail");
    const warnings = checks.filter((c) => c.status === "warn");

    if (failures.length === 0 && warnings.length === 0) {
      p.outro(c.success("✨ All checks passed!"));
    } else if (failures.length === 0) {
      p.outro(c.warning("⚠ Some warnings found"));
    } else {
      p.outro(c.error("✖ Issues found — see above for fixes"));
    }
  },
});