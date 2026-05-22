#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import pkg from "../package.json";

const main = defineCommand({
  meta: {
    name: "bliss",
    version: pkg.version,
    description: "System architecture and optimization engine",
  },
  // Register child sub-commands here
  subCommands: {
    init: () => import("./commands/init").then((r) => r.default),
    boost: () => import("./commands/boost").then((r) => r.default),
  },
});

runMain(main);