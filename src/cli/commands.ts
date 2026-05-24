import type { CommandDef } from "citty";

// Command registry - add new commands here
const commandImports = {
  create: () => import("../commands/create.ts").then((r) => r.default),
  init: () => import("../commands/init.ts").then((r) => r.default),
  add: () => import("../commands/add.ts").then((r) => r.default),
  remove: () => import("../commands/remove.ts").then((r) => r.default),
  list: () => import("../commands/list.ts").then((r) => r.default),
  update: () => import("../commands/update.ts").then((r) => r.default),
  doctor: () => import("../commands/doctor.ts").then((r) => r.default),
  deploy: () => import("../commands/deploy.ts").then((r) => r.default),
  git: () => import("../commands/git.ts").then((r) => r.default),
  help: () => import("../commands/help.ts").then((r) => r.default),
};

// Aliases for backward compatibility
const aliases: Record<string, string> = {
  boost: "add",
  install: "add",
  uninstall: "remove",
  ls: "list",
  check: "doctor",
  h: "help",
};

export function registerCommands(): Record<string, () => Promise<CommandDef>> {
  const commands: Record<string, () => Promise<CommandDef>> = {};

  for (const [name, importer] of Object.entries(commandImports)) {
    commands[name] = importer;
  }

  // Register aliases
  for (const [alias, target] of Object.entries(aliases)) {
    commands[alias] = commandImports[target as keyof typeof commandImports];
  }

  return commands;
}

export function getCommandList(): string[] {
  return Object.keys(commandImports);
}

export function getCommandDescription(name: string): string {
  const descriptions: Record<string, string> = {
    create: "Scaffold a new project from template",
    init: "Analyze and configure an existing project",
    add: "Inject a module into your project",
    remove: "Remove an injected module",
    list: "List installed and available modules",
    update: "Update a module to latest version",
    doctor: "Run health checks on your project",
    deploy: "Generate deployment configuration",
    git: "Git and GitHub helpers",
    help: "Show help for commands",
  };
  return descriptions[name] || "No description available";
}