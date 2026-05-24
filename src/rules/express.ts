import type { FrameworkMeta } from "../types/framework.ts";

export const expressMeta: FrameworkMeta = {
  name: "express",
  displayName: "Express.js",
  packageName: "express",
  language: "javascript",
  hasRouter: true,
  defaultPort: 3000,
};

export function detectExpress(packageJson: { dependencies?: Record<string, string> }): boolean {
  return "express" in (packageJson.dependencies || {});
}

export const expressFiles = [
  "src/index.ts",
  "src/index.js",
  "src/app.ts",
  "src/app.js",
  "src/server.ts",
  "src/server.js",
];

export const expressPatterns = [
  /express\(\)/,
  /from ["']express["']/,
  /require\(["']express["']\)/,
];