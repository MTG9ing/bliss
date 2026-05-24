import type { FrameworkMeta } from "../types/framework.ts";

export const elysiaMeta: FrameworkMeta = {
  name: "elysia",
  displayName: "Elysia",
  packageName: "elysia",
  language: "typescript",
  hasRouter: true,
  defaultPort: 3000,
};

export function detectElysia(packageJson: { dependencies?: Record<string, string> }): boolean {
  return "elysia" in (packageJson.dependencies || {});
}

export const elysiaPatterns = [
  /new Elysia\(/,
  /from ["']elysia["']/,
];