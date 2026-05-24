import { defineCommand } from "citty";
import pkg from "../../package.json";
import { registerCommands } from "./commands.ts";

export const mainCommand = defineCommand({
  meta: {
    name: "bliss",
    version: pkg.version,
    description: "System architecture and optimization engine",
  },
  subCommands: registerCommands(),
});