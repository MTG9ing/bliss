import type { FrameworkMeta } from "../types/framework.ts";

export const fastifyMeta: FrameworkMeta = {
  name: "fastify",
  displayName: "Fastify",
  packageName: "fastify",
  language: "javascript",
  hasRouter: true,
  defaultPort: 3000,
};

export function detectFastify(packageJson: { dependencies?: Record<string, string> }): boolean {
  return "fastify" in (packageJson.dependencies || {});
}

export const fastifyPatterns = [
  /Fastify\(/,
  /from ["']fastify["']/,
  /require\(["']fastify["']\)/,
];