import { spawn } from "node:child_process";
import { BlissConfig } from "./config";

/**
 * Dynamically resolves the exact package manager installation arguments
 */
function getInstallCommand(packageManager: BlissConfig["packageManager"], packages: string[]): string[] {
  switch (packageManager) {
    case "bun":
      return ["bun", "add", ...packages];
    case "pnpm":
      return ["pnpm", "add", ...packages];
    case "yarn":
      return ["yarn", "add", ...packages];
    default:
      return ["npm", "install", ...packages];
  }
}

/**
 * Spawns a background shell process to install dependencies safely
 */
export async function installPackages(
  packageManager: BlissConfig["packageManager"], 
  packages: string[]
): Promise<boolean> {
  return new Promise((resolve) => {
    // 1. Build the full command string
    // On Windows, npm is npm.cmd, others are just their name
    const baseCmd = packageManager === "npm" && process.platform === "win32" ? "npm.cmd" : packageManager;
    const action = packageManager === "npm" ? "install" : "add";
    const fullCommand = `${baseCmd} ${action} ${packages.join(" ")}`;

    console.log(`[DEBUG] Executing: ${fullCommand}`);

    // 2. Spawn with shell: true
    const child = spawn(fullCommand, {
      stdio: "inherit",
      shell: true, 
    });

    child.on("close", (code) => {
      resolve(code === 0);
    });

    child.on("error", (err) => {
      console.error("[DEBUG] Spawn Error:", err);
      resolve(false);
    });
  });
}