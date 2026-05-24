import type { FrameworkMeta } from "../types/framework.ts";

export const honoMeta: FrameworkMeta = {
  name: "hono",
  displayName: "Hono",
  packageName: "hono",
  language: "typescript",
  hasRouter: true,
  defaultPort: 3000,
};

export function detectHono(packageJson: { dependencies?: Record<string, string> }): boolean {
  return "hono" in (packageJson.dependencies || {});
}

export const honoPatterns = [
  /new Hono\(/,
  /from ["']hono["']/,
];