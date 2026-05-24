#!/usr/bin/env node
import { runMain } from "citty";
import { mainCommand } from "./cli/index.ts";

runMain(mainCommand);