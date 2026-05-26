import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import * as p from "@clack/prompts";
import { defineCommand } from "citty";
import { logger } from "../core/logger.ts";
import { c } from "../utils/colors.ts";
import { blissLogsDir } from "../utils/path.ts";

export default defineCommand({
  meta: {
    name: "logs",
    description: "View activity history",
  },
  args: {
    lines: {
      type: "string",
      description: "Number of lines to show",
      default: "50",
    },
  },
  async run({ args }) {
    p.intro(c.bold("📋 Bliss Logs — Activity History"));

    const cwd = process.cwd();
    const logsDir = blissLogsDir(cwd);

    if (!existsSync(logsDir)) {
      p.note(`Logs location: ${logsDir}`);
      p.cancel(
        "No logs directory found. Run some Bliss commands first (e.g., 'bliss create my-app').",
      );
      return;
    }

    const files = readdirSync(logsDir)
      .filter((f) => f.endsWith(".log"))
      .sort()
      .reverse();

    if (files.length === 0) {
      p.note(`Logs directory: ${logsDir}`);
      p.cancel("No log files found. Run a Bliss command to generate logs.");
      return;
    }

    // Show recent entries from latest file
    const latestFile = join(logsDir, files[0]);
    const content = readFileSync(latestFile, "utf-8");
    const lines = content
      .trim()
      .split("\n")
      .filter((l) => l.trim());

    const limit = parseInt(args.lines, 10) || 50;
    const recent = lines.slice(-limit);

    console.log(c.dim(`\nShowing last ${recent.length} entries from ${files[0]}\n`));

    for (const line of recent) {
      // Parse log line: [ISO] [LEVEL] message
      const match = line.match(/^\[([^\]]+)\]\s+\[([^\]]+)\]\s+(.*)$/);
      if (match) {
        const [, timestamp, level, message] = match;
        const time = timestamp.split("T")[1].slice(0, 8);
        const color =
          level === "ERROR"
            ? c.error
            : level === "WARN"
              ? c.warning
              : level === "SUCCESS"
                ? c.success
                : c.dim;
        console.log(`${c.dim(time)} ${color(`[${level}]`)} ${message}`);
      } else {
        console.log(c.dim(line));
      }
    }

    if (files.length > 1) {
      console.log(c.dim(`\n...and ${files.length - 1} older log file(s)`));
    }

    p.outro(c.dim("\nUse 'bliss logs --lines 100' for more"));
  },
});
