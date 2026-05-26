import { execSync } from "node:child_process";
import type { PackageManager } from "../types/framework.ts";
import { logger } from "./logger.ts";

/**
 * Check if a package manager is installed and available
 */
export function isPackageManagerAvailable(pm: PackageManager): boolean {
  try {
    const checkCmd = pm === "bun" ? "bun --version" : `${pm} --version`;
    execSync(checkCmd, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export interface PackageManagerCommands {
  name: PackageManager;
  install: (deps: string[], dev?: boolean) => string;
  uninstall: (deps: string[]) => string;
  run: (script: string) => string;
  init: string;
  exec: (bin: string) => string;
}

const PM_COMMANDS: Record<PackageManager, PackageManagerCommands> = {
  bun: {
    name: "bun",
    install: (deps, dev) => `bun add${dev ? " -d" : ""} ${deps.join(" ")}`,
    uninstall: (deps) => `bun remove ${deps.join(" ")}`,
    run: (script) => `bun run ${script}`,
    init: "bun init -y",
    exec: (bin) => `bunx ${bin}`,
  },
  npm: {
    name: "npm",
    install: (deps, dev) => `npm install${dev ? " --save-dev" : ""} ${deps.join(" ")}`,
    uninstall: (deps) => `npm uninstall ${deps.join(" ")}`,
    run: (script) => `npm run ${script}`,
    init: "npm init -y",
    exec: (bin) => `npx ${bin}`,
  },
  pnpm: {
    name: "pnpm",
    install: (deps, dev) => `pnpm add${dev ? " -D" : ""} ${deps.join(" ")}`,
    uninstall: (deps) => `pnpm remove ${deps.join(" ")}`,
    run: (script) => `pnpm ${script}`,
    init: "pnpm init",
    exec: (bin) => `pnpm exec ${bin}`,
  },
  yarn: {
    name: "yarn",
    install: (deps, dev) => `yarn add${dev ? " --dev" : ""} ${deps.join(" ")}`,
    uninstall: (deps) => `yarn remove ${deps.join(" ")}`,
    run: (script) => `yarn ${script}`,
    init: "yarn init -y",
    exec: (bin) => `yarn ${bin}`,
  },
};

export function getPackageManager(name: PackageManager): PackageManagerCommands {
  return PM_COMMANDS[name];
}

/**
 * Install dependencies using detected package manager
 * Validates that the package manager is available first
 */
export function installPackages(
  deps: string[],
  pm: PackageManager,
  cwd: string,
  isDev = false,
): boolean {
  if (deps.length === 0) return true;

  // Check if package manager is available
  if (!isPackageManagerAvailable(pm)) {
    logger.error(`Package manager '${pm}' is not installed or not available in PATH`);
    logger.info(`Please install '${pm}' or configure a different package manager`);
    return false;
  }

  const cmd = getPackageManager(pm).install(deps, isDev);
  logger.step(`Installing with ${pm}: ${deps.join(", ")}`);

  try {
    execSync(cmd, { cwd, stdio: "inherit" });
    logger.success(`Installed ${deps.length} package${deps.length > 1 ? "s" : ""} with ${pm}`);
    return true;
  } catch (err) {
    logger.error(`Failed to install packages: ${(err as Error).message}`);
    return false;
  }
}

/**
 * Uninstall dependencies
 */
export function uninstallPackages(deps: string[], pm: PackageManager, cwd: string): boolean {
  if (deps.length === 0) return true;

  const cmd = getPackageManager(pm).uninstall(deps);
  logger.step(`Removing: ${deps.join(" ")}`);

  try {
    execSync(cmd, { cwd, stdio: "inherit" });
    logger.success(`Removed ${deps.length} package${deps.length > 1 ? "s" : ""}`);
    return true;
  } catch (err) {
    logger.error(`Failed to remove packages: ${(err as Error).message}`);
    return false;
  }
}

/**
 * Run a script using the package manager
 */
export function runScript(script: string, pm: PackageManager, cwd: string): boolean {
  const cmd = getPackageManager(pm).run(script);
  logger.step(`Running: ${cmd}`);

  try {
    execSync(cmd, { cwd, stdio: "inherit" });
    return true;
  } catch (err) {
    logger.error(`Script failed: ${(err as Error).message}`);
    return false;
  }
}

/**
 * Initialize a new package.json
 */
export function initPackage(pm: PackageManager, cwd: string): boolean {
  const cmd = getPackageManager(pm).init;
  logger.step(`Initializing package.json with ${pm}`);

  try {
    execSync(cmd, { cwd, stdio: "inherit" });
    return true;
  } catch (err) {
    logger.error(`Failed to init package: ${(err as Error).message}`);
    return false;
  }
}
