import { defineCommand } from "citty";
import { generateHelp } from "../cli/help.ts";

export default defineCommand({
  meta: {
    name: "help",
    description: "Show help for commands",
  },
  args: {
    command: {
      type: "positional",
      description: "Command to show help for",
      required: false,
    },
  },
  run({ args }) {
    if (args.command) {
      console.log(`\nHelp for: bliss ${args.command}\n`);
      console.log("Run 'bliss --help' for general usage.");
    } else {
      console.log(generateHelp());
    }
  },
});
