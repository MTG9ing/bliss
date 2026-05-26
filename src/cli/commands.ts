import type { CommandDef } from "citty";

// Command registry — lazy load for fast startup
const commandImports: Record<string, () => Promise<CommandDef>> = {
  create: () => import("../commands/create.ts").then((r) => r.default),
  init: () => import("../commands/init.ts").then((r) => r.default),
  add: () => import("../commands/add.ts").then((r) => r.default),
  remove: () => import("../commands/remove.ts").then((r) => r.default),
  doctor: () => import("../commands/doctor.ts").then((r) => r.default),
  git: () => import("../commands/git.ts").then((r) => r.default),
  logs: () => import("../commands/logs.ts").then((r) => r.default),
  help: () => import("../commands/help.ts").then((r) => r.default),
};

// Aliases
const aliases: Record<string, string> = {
  new: "create",
  scaffold: "create",
  setup: "init",
  install: "add",
  boost: "add",
  uninstall: "remove",
  check: "doctor",
  diagnose: "doctor",
  gh: "git",
  activity: "logs",
  history: "logs",
  h: "help",
};

export function registerCommands(): Record<string, () => Promise<CommandDef>> {
  const commands: Record<string, () => Promise<CommandDef>> = {};

  for (const [name, importer] of Object.entries(commandImports)) {
    commands[name] = importer;
  }

  for (const [alias, target] of Object.entries(aliases)) {
    commands[alias] = commandImports[target];
  }

  return commands;
}

export function getCommandList(): string[] {
  return Object.keys(commandImports);
}

export function getCommandDescription(name: string): string {
  const descriptions: Record<string, string> = {
    create: "Scaffold a new project from template",
    init: "Configure or bootstrap current directory",
    add: "Inject a feature module into your project",
    remove: "Remove an injected feature module",
    doctor: "Run health checks on your project",
    git: "Git and GitHub helpers",
    logs: "View activity history",
    help: "Show help for commands",
  };
  return descriptions[name] || "No description available";
}
