#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runMain } from "citty";
import { registerCommands } from "./commands.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve package.json: try project root first, then fallback to dist/
// Source: src/cli/index.ts → __dirname = src/cli/ → ../../ = project root
// Built: dist/cli/index.js → __dirname = dist/cli/ → ../../ = project root
const pkgPath = resolve(__dirname, "..", "..", "package.json");

let pkg: { version: string };
try {
  pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
} catch {
  // Fallback: maybe package.json was copied to dist/
  const fallbackPath = resolve(__dirname, "..", "package.json");
  pkg = JSON.parse(readFileSync(fallbackPath, "utf-8"));
}

const mainCommand = {
  meta: {
    name: "bliss",
    version: pkg.version,
    description: "The automated backend architect for Node.js and Bun",
  },
  subCommands: registerCommands(),
};

runMain(mainCommand);
