import { execSync } from "node:child_process";
import type { ProjectContext } from "../types/index.ts";
import { logger } from "./logger.ts";

function pmCommand(pm: ProjectContext["packageManager"], isDev: boolean): string {
  const devFlag = isDev ? " -D" : "";
  switch (pm) {
    case "bun":
      return `bun add${devFlag}`;
    case "pnpm":
      return `pnpm add${devFlag}`;
    case "yarn":
      return `yarn add${devFlag}`;
    default:
      return `npm install${devFlag}`;
  }
}

export function installPackages(
  packages: string[],
  context: ProjectContext,
  isDev = false,
): boolean {
  if (packages.length === 0) return true;

  const cmd = `${pmCommand(context.packageManager, isDev)} ${packages.join(" ")}`;
  logger.step(`Installing: ${packages.join(", ")}`);

  try {
    execSync(cmd, { cwd: context.cwd, stdio: "inherit" });
    logger.success("Packages installed");
    return true;
  } catch {
    logger.error("Failed to install packages");
    return false;
  }
}

export function uninstallPackages(packages: string[], context: ProjectContext): boolean {
  if (packages.length === 0) return true;

  let cmd: string;
  switch (context.packageManager) {
    case "bun":
      cmd = `bun remove ${packages.join(" ")}`;
      break;
    case "pnpm":
      cmd = `pnpm remove ${packages.join(" ")}`;
      break;
    case "yarn":
      cmd = `yarn remove ${packages.join(" ")}`;
      break;
    default:
      cmd = `npm uninstall ${packages.join(" ")}`;
  }

  logger.step(`Removing: ${packages.join(", ")}`);

  try {
    execSync(cmd, { cwd: context.cwd, stdio: "inherit" });
    logger.success("Packages removed");
    return true;
  } catch {
    logger.error("Failed to remove packages");
    return false;
  }
}