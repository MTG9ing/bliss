#!/usr/bin/env node
import { runMain } from "citty";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { registerCommands } from "./commands.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
// When built to dist/index.js, __dirname is dist/, so go up 1 level to project root
const pkgPath = resolve(__dirname, "..", "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

const mainCommand = {
  meta: {
    name: "bliss",
    version: pkg.version,
    description: "The automated backend architect for Node.js and Bun",
  },
  subCommands: registerCommands(),
};

runMain(mainCommand);