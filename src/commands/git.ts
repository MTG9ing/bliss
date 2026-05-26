import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import * as p from "@clack/prompts";
import { defineCommand } from "citty";
import { logger } from "../core/logger.ts";
import { c } from "../utils/colors.ts";

function runGit(args: string[], cwd = process.cwd()): string {
  return execSync(`git ${args.join(" ")}`, { cwd, encoding: "utf-8" }).trim();
}

function hasGitHubCLI(): boolean {
  try {
    execSync("gh --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function getGitHubUser(): string | null {
  try {
    return runGit(["config", "--global", "user.name"]);
  } catch {
    return null;
  }
}

export default defineCommand({
  meta: {
    name: "git",
    description: "Git and GitHub helpers",
  },
  args: {
    action: {
      type: "positional",
      description: "Action to perform",
      required: false,
    },
  },
  async run({ args }) {
    p.intro(c.bold("🔀 Bliss Git — Your senior developer"));

    const cwd = process.cwd();
    let action = args.action;

    // Interactive menu if no action
    if (!action) {
      const isGitRepo = existsSync(join(cwd, ".git"));
      const hasGh = hasGitHubCLI();
      const ghUser = getGitHubUser();

      const options: { value: string; label: string; hint?: string }[] = [
        { value: "status", label: "Check status" },
        { value: "add", label: "Stage changes" },
        { value: "commit", label: "Commit changes" },
        { value: "push", label: "Push to remote" },
        { value: "pull", label: "Pull from remote" },
        { value: "log", label: "View log" },
        { value: "branch", label: "Manage branches" },
        { value: "undo", label: "Undo last commit" },
      ];

      if (!isGitRepo) {
        options.unshift({ value: "init", label: "Initialize repository" });
      }

      if (hasGh) {
        options.push(
          { value: "pr", label: "Create Pull Request", hint: "GitHub" },
          { value: "issue", label: "Create Issue", hint: "GitHub" },
        );
      }

      options.push({ value: "whoami", label: "Who am I?", hint: ghUser || "Not configured" });

      action = (await p.select({
        message: "What would you like to do?",
        options,
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
          runGit(["add", "."], cwd);
          console.log(c.success("✔ Git repository initialized"));
          break;
        }

        case "status": {
          const status = runGit(["status", "--short"], cwd);
          if (status) {
            console.log(c.info("\nChanges:"));
            console.log(status);
          } else {
            console.log(c.success("✔ Working tree clean"));
          }
          break;
        }

        case "add": {
          const status = runGit(["status", "--short"], cwd);
          if (!status) {
            console.log(c.warning("No changes to stage"));
            return;
          }
          const files = status
            .split("\n")
            .map((l) => l.slice(3).trim())
            .filter(Boolean);
          const selected = await p.multiselect({
            message: "Select files to stage:",
            options: files.map((f) => ({ value: f, label: f })),
          });
          if (p.isCancel(selected) || !Array.isArray(selected) || selected.length === 0) {
            p.cancel("No files selected");
            return;
          }
          for (const file of selected) {
            runGit(["add", file], cwd);
          }
          console.log(c.success(`✔ Staged ${selected.length} file(s)`));
          break;
        }

        case "commit": {
          const message = (await p.text({
            message: "Commit message?",
            placeholder: "feat: add new feature",
            validate: (v) => (!v ? "Message required" : undefined),
          })) as string;

          if (p.isCancel(message)) return;

          // Conventional commit helper
          if (!message.includes(":")) {
            const type = await p.select({
              message: "Commit type?",
              options: [
                { value: "feat", label: "feat — New feature" },
                { value: "fix", label: "fix — Bug fix" },
                { value: "docs", label: "docs — Documentation" },
                { value: "style", label: "style — Formatting" },
                { value: "refactor", label: "refactor — Code change" },
                { value: "test", label: "test — Tests" },
                { value: "chore", label: "chore — Maintenance" },
              ],
            });
            if (!p.isCancel(type)) {
              const finalMessage = `${type}: ${message}`;
              runGit(["commit", "-m", finalMessage], cwd);
              console.log(c.success(`✔ Committed: ${finalMessage}`));
              break;
            }
          }

          runGit(["commit", "-m", message], cwd);
          console.log(c.success(`✔ Committed: ${message}`));
          break;
        }

        case "push": {
          const branch = runGit(["branch", "--show-current"], cwd);
          const confirm = await p.confirm({
            message: `Push ${branch} to origin?`,
            initialValue: true,
          });
          if (confirm) {
            runGit(["push", "origin", branch], cwd);
            console.log(c.success(`✔ Pushed ${branch}`));
          }
          break;
        }

        case "pull": {
          const branch = runGit(["branch", "--show-current"], cwd);
          runGit(["pull", "origin", branch], cwd);
          console.log(c.success(`✔ Pulled ${branch}`));
          break;
        }

        case "log": {
          const log = runGit(["log", "--oneline", "--graph", "-15"], cwd);
          console.log(c.info("\nRecent commits:"));
          console.log(log);
          break;
        }

        case "branch": {
          const action = await p.select({
            message: "Branch action?",
            options: [
              { value: "list", label: "List branches" },
              { value: "create", label: "Create branch" },
              { value: "switch", label: "Switch branch" },
              { value: "delete", label: "Delete branch" },
            ],
          });

          switch (action) {
            case "list": {
              const branches = runGit(["branch", "-a"], cwd);
              console.log(c.info("\nBranches:"));
              console.log(branches);
              break;
            }
            case "create": {
              const name = (await p.text({
                message: "Branch name?",
                validate: (v) => (!v ? "Name required" : undefined),
              })) as string;
              if (!p.isCancel(name)) {
                runGit(["checkout", "-b", name], cwd);
                console.log(c.success(`✔ Created branch: ${name}`));
              }
              break;
            }
            case "switch": {
              const branches = runGit(["branch", "--format=%(refname:short)"], cwd)
                .split("\n")
                .filter((b) => b.trim());
              const branch = (await p.select({
                message: "Switch to?",
                options: branches.map((b) => ({ value: b, label: b })),
              })) as string;
              if (!p.isCancel(branch)) {
                runGit(["checkout", branch], cwd);
                console.log(c.success(`✔ Switched to ${branch}`));
              }
              break;
            }
            case "delete": {
              const branches = runGit(["branch", "--format=%(refname:short)"], cwd)
                .split("\n")
                .filter((b) => b.trim());
              const branch = (await p.select({
                message: "Delete branch?",
                options: branches.map((b) => ({ value: b, label: b })),
              })) as string;
              if (!p.isCancel(branch)) {
                const force = await p.confirm({
                  message: `Force delete ${branch}?`,
                  initialValue: false,
                });
                const flag = force ? "-D" : "-d";
                runGit(["branch", flag, branch], cwd);
                console.log(c.success(`✔ Deleted ${branch}`));
              }
              break;
            }
          }
          break;
        }

        case "undo": {
          const confirm = await p.confirm({
            message: "Undo last commit? (keeps changes)",
            initialValue: false,
          });
          if (confirm) {
            runGit(["reset", "--soft", "HEAD~1"], cwd);
            console.log(c.success("✔ Last commit undone (changes preserved)"));
          }
          break;
        }

        case "whoami": {
          const gitUser = getGitHubUser();
          const gitEmail = (() => {
            try {
              return runGit(["config", "--global", "user.email"]);
            } catch {
              return null;
            }
          })();

          console.log(c.info("\nGit Configuration:"));
          if (gitUser) console.log(`  Name:  ${c.bold(gitUser)}`);
          if (gitEmail) console.log(`  Email: ${c.bold(gitEmail)}`);

          if (hasGitHubCLI()) {
            try {
              const ghUser = execSync("gh api user -q .login", { encoding: "utf-8" }).trim();
              console.log(c.success(`\n✔ GitHub CLI: @${ghUser}`));
            } catch {
              console.log(c.warning("\n⚠ GitHub CLI not authenticated"));
              console.log(c.dim("  Run: gh auth login"));
            }
          } else {
            console.log(c.warning("\n⚠ GitHub CLI not installed"));
            console.log(c.dim("  Install: https://cli.github.com"));
          }

          const token = process.env.GITHUB_TOKEN;
          if (token) {
            console.log(c.success("\n✔ GITHUB_TOKEN environment variable set"));
          }
          break;
        }

        case "pr": {
          if (!hasGitHubCLI()) {
            console.log(c.error("✖ GitHub CLI required. Install: https://cli.github.com"));
            return;
          }
          const title = (await p.text({
            message: "PR title?",
            validate: (v) => (!v ? "Title required" : undefined),
          })) as string;
          const body = (await p.text({
            message: "PR description? (optional)",
          })) as string;
          const draft = await p.confirm({
            message: "Draft PR?",
            initialValue: false,
          });

          if (p.isCancel(title)) return;

          const args = ["pr", "create", "--title", title];
          if (body) args.push("--body", body);
          if (draft) args.push("--draft");

          execSync(`gh ${args.join(" ")}`, { cwd, stdio: "inherit" });
          console.log(c.success("✔ Pull request created"));
          break;
        }

        case "issue": {
          if (!hasGitHubCLI()) {
            console.log(c.error("✖ GitHub CLI required"));
            return;
          }
          const title = (await p.text({
            message: "Issue title?",
            validate: (v) => (!v ? "Title required" : undefined),
          })) as string;
          const body = (await p.text({
            message: "Issue description? (optional)",
          })) as string;

          if (p.isCancel(title)) return;

          const args = ["issue", "create", "--title", title];
          if (body) args.push("--body", body);

          execSync(`gh ${args.join(" ")}`, { cwd, stdio: "inherit" });
          console.log(c.success("✔ Issue created"));
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
