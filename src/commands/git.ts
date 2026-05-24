import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { c } from "../utils/colors.ts";

function runGit(args: string[], cwd = process.cwd()): string {
  return execSync(`git ${args.join(" ")}`, { cwd, encoding: "utf-8" }).trim();
}

export default defineCommand({
  meta: {
    name: "git",
    description: "Git and GitHub helpers",
  },
  args: {
    action: {
      type: "positional",
      description: "Action: init, status, commit, push, pull, log",
      required: false,
    },
    message: {
      type: "string",
      description: "Commit message",
      alias: "m",
    },
  },
  async run({ args }) {
    p.intro(c.bold("🔀 Bliss Git — Git helpers"));

    const cwd = process.cwd();
    let action = args.action;

    if (!action) {
      action = (await p.select({
        message: "What would you like to do?",
        options: [
          { value: "status", label: "Check status" },
          { value: "commit", label: "Commit changes" },
          { value: "push", label: "Push to remote" },
          { value: "pull", label: "Pull from remote" },
          { value: "log", label: "View log" },
          { value: "init", label: "Initialize repo" },
        ],
      })) as string;
    }

    if (p.isCancel(action)) {
      p.cancel("Cancelled");
      return;
    }

    try {
      switch (action) {
        case "init": {
          if (existsSync(join(cwd, ".git"))) {
            console.log(c.warning("Git repository already initialized"));
            return;
          }
          runGit(["init"], cwd);
          console.log(c.success("✔ Git repository initialized"));
          break;
        }
        case "status": {
          const status = runGit(["status", "--short"], cwd);
          if (status) {
            console.log(c.info("\\nChanges:"));
            console.log(status);
          } else {
            console.log(c.success("✔ Working tree clean"));
          }
          break;
        }
        case "commit": {
          let message = args.message;
          if (!message) {
            message = (await p.text({
              message: "Commit message?",
              validate: (v) => !v ? "Message required" : undefined,
            })) as string;
          }
          if (p.isCancel(message)) return;

          runGit(["add", "."], cwd);
          runGit(["commit", "-m", message], cwd);
          console.log(c.success(`✔ Committed: ${message}`));
          break;
        }
        case "push": {
          const branch = runGit(["branch", "--show-current"], cwd);
          runGit(["push", "origin", branch], cwd);
          console.log(c.success(`✔ Pushed to ${branch}`));
          break;
        }
        case "pull": {
          const branch = runGit(["branch", "--show-current"], cwd);
          runGit(["pull", "origin", branch], cwd);
          console.log(c.success(`✔ Pulled from ${branch}`));
          break;
        }
        case "log": {
          const log = runGit(["log", "--oneline", "-10"], cwd);
          console.log(c.info("\\nRecent commits:"));
          console.log(log);
          break;
        }
        default:
          console.log(c.warning(`Unknown action: ${action}`));
      }
    } catch (err) {
      console.log(c.error(`✖ Git error: ${(err as Error).message}`));
    }

    p.outro(c.dim("Done"));
  },
});