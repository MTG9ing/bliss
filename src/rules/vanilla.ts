import type { FrameworkMeta } from "../types/framework.ts";

export const vanillaMeta: FrameworkMeta = {
  name: "vanilla",
  displayName: "Vanilla Node.js",
  packageName: "",
  language: "javascript",
  hasRouter: false,
  defaultPort: 3000,
};

export function detectVanilla(packageJson: { dependencies?: Record<string, string> }): boolean {
  const deps = Object.keys(packageJson.dependencies || {});
  const frameworkDeps = ["express", "fastify", "hono", "elysia", "koa"];
  return deps.length === 0 || !deps.some((d) => frameworkDeps.includes(d));
}

export const vanillaPatterns = [
  /createServer/,
  /from ["']node:http["']/,
  /require\(["']http["']\)/,
];