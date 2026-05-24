import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { hasConfig, loadConfig } from "../core/config.ts";
import { c } from "../utils/colors.ts";

const dockerfileTemplate = (framework: string, language: string) => `FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build (if TypeScript)
${language === "typescript" ? "RUN bun run build" : "# No build step needed"}

# Production
FROM oven/bun:1-slim AS production
WORKDIR /app
COPY --from=base /app/${language === "typescript" ? "dist" : "src"} ./${language === "typescript" ? "dist" : "src"}
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./

EXPOSE 3000
ENV NODE_ENV=production

CMD ["bun", "run", "start"]
`;

const dockerComposeTemplate = `version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
`;

const flyTomlTemplate = (appName: string) => `app = "${appName}"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
`;

export default defineCommand({
  meta: {
    name: "deploy",
    description: "Generate deployment configuration",
  },
  args: {
    target: {
      type: "string",
      description: "Deployment target (docker, fly, render, vercel)",
      alias: "t",
    },
  },
  async run({ args }) {
    p.intro(c.bold("🚀 Bliss Deploy — Generate deployment config"));

    const cwd = process.cwd();
    if (!hasConfig(cwd)) {
      p.cancel("No bliss.config.json found. Run 'bliss init' first.");
      return;
    }

    const config = loadConfig(cwd);
    if (!config) return;

    let target = args.target;
    if (!target) {
      target = (await p.select({
        message: "Deployment target?",
        options: [
          { value: "docker", label: "Docker" },
          { value: "fly", label: "Fly.io" },
          { value: "render", label: "Render" },
          { value: "vercel", label: "Vercel" },
        ],
      })) as string;
    }

    if (p.isCancel(target)) {
      p.cancel("Cancelled");
      return;
    }

    const s = p.spinner();
    s.start(`Generating ${target} config...`);

    switch (target) {
      case "docker": {
        writeFileSync(
          join(cwd, "Dockerfile"),
          dockerfileTemplate(config.framework, config.language)
        );
        writeFileSync(join(cwd, "docker-compose.yml"), dockerComposeTemplate);
        s.stop("Docker files created");
        console.log(c.dim("  → Dockerfile"));
        console.log(c.dim("  → docker-compose.yml"));
        break;
      }
      case "fly": {
        const appName = config.framework + "-app"; // Could prompt for this
        writeFileSync(join(cwd, "fly.toml"), flyTomlTemplate(appName));
        s.stop("Fly.io config created");
        console.log(c.dim("  → fly.toml"));
        console.log(c.dim("\n  Run: fly deploy"));
        break;
      }
      case "render": {
        writeFileSync(
          join(cwd, "render.yaml"),
          `services:\n  - type: web\n    name: ${config.framework}-app\n    runtime: node\n    buildCommand: npm install${config.language === "typescript" ? " && npm run build" : ""}\n    startCommand: npm start\n`
        );
        s.stop("Render config created");
        console.log(c.dim("  → render.yaml"));
        break;
      }
      case "vercel": {
        writeFileSync(
          join(cwd, "vercel.json"),
          JSON.stringify({ version: 2, builds: [{ src: "src/index.ts", use: "@vercel/node" }] }, null, 2)
        );
        s.stop("Vercel config created");
        console.log(c.dim("  → vercel.json"));
        break;
      }
      default:
        s.stop("Unknown target");
    }

    p.outro(c.success("Done!"));
  },
});