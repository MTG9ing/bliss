import { existsSync } from "node:fs";
import { join } from "node:path";
import type { ProjectContext } from "../types/index.ts";
import { readJson } from "../utils/fs.ts";
import { logger } from "./logger.ts";

export interface HealthCheck {
  name: string;
  status: "pass" | "warn" | "fail";
  message: string;
  fix?: string;
}

export function runHealthChecks(context: ProjectContext): HealthCheck[] {
  const checks: HealthCheck[] = [];

  // Check package.json exists
  const pkgPath = join(context.cwd, "package.json");
  if (!existsSync(pkgPath)) {
    checks.push({
      name: "package.json",
      status: "fail",
      message: "No package.json found",
      fix: "Run `npm init` or `bliss create`",
    });
    return checks;
  }

  const pkg = readJson<{ scripts?: Record<string, string> }>(pkgPath);

  // Check start script
  if (!pkg?.scripts?.start && !pkg?.scripts?.dev) {
    checks.push({
      name: "Start script",
      status: "warn",
      message: "No start or dev script in package.json",
      fix: "Add a start script",
    });
  } else {
    checks.push({
      name: "Start script",
      status: "pass",
      message: "Start/dev script found",
    });
  }

  // Check bliss config
  const blissConfig = join(context.cwd, "bliss.config.json");
  if (!existsSync(blissConfig)) {
    checks.push({
      name: "Bliss config",
      status: "warn",
      message: "No bliss.config.json found",
      fix: "Run `bliss init`",
    });
  } else {
    checks.push({
      name: "Bliss config",
      status: "pass",
      message: "bliss.config.json present",
    });
  }

  // Check node_modules
  if (!existsSync(join(context.cwd, "node_modules"))) {
    checks.push({
      name: "Dependencies",
      status: "warn",
      message: "node_modules not found",
      fix: "Run install command",
    });
  } else {
    checks.push({
      name: "Dependencies",
      status: "pass",
      message: "node_modules present",
    });
  }

  // Check .git
  if (!existsSync(join(context.cwd, ".git"))) {
    checks.push({
      name: "Git",
      status: "warn",
      message: "Not a git repository",
      fix: "Run `git init`",
    });
  } else {
    checks.push({
      name: "Git",
      status: "pass",
      message: "Git repository initialized",
    });
  }

  return checks;
}

export function printHealthChecks(checks: HealthCheck[]): void {
  const pass = checks.filter((c) => c.status === "pass").length;
  const warn = checks.filter((c) => c.status === "warn").length;
  const fail = checks.filter((c) => c.status === "fail").length;

  logger.info(`Health check results: ${pass} pass, ${warn} warn, ${fail} fail`);

  for (const check of checks) {
    const icon = check.status === "pass" ? "✔" : check.status === "warn" ? "⚠" : "✖";
    const color = check.status === "pass" ? "success" : check.status === "warn" ? "warn" : "error";
    logger[color](`${icon} ${check.name}: ${check.message}`);
    if (check.fix) {
      logger.info(`  Fix: ${check.fix}`);
    }
  }
}