import type { FrameworkMeta } from "../types/framework.ts";

export const koaMeta: FrameworkMeta = {
  name: "koa",
  displayName: "Koa",
  packageName: "koa",
  language: "javascript",
  hasRouter: true,
  defaultPort: 3000,
};

export function detectKoa(packageJson: { dependencies?: Record<string, string> }): boolean {
  return "koa" in (packageJson.dependencies || {});
}

export const koaPatterns = [
  /new Koa\(/,
  /from ["']koa["']/,
  /require\(["']koa["']\)/,
];