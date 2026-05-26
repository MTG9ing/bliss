/**
 * Framework definitions — single source of truth
 * Add new frameworks here and create templates/[framework]/ directory
 */

export type Framework = "express" | "fastify" | "vanilla";

export const FRAMEWORKS: Framework[] = ["express", "fastify", "vanilla"];

export type Language = "typescript" | "javascript";

export type PackageManager = "npm" | "bun" | "pnpm";

export type ProjectType = "starter" | "backend" | "library" | "frontend";

export type ProjectStructure =
  | "standard"
  | "mvc"
  | "microservices"
  | "oop"
  | "functional"
  | "hexagonal";

export interface FrameworkMeta {
  name: Framework;
  displayName: string;
  packageName: string;
  entryFiles: string[];
  port: number;
  language: Language; // Primary language, project can override
}

export const FRAMEWORK_META: Record<Framework, FrameworkMeta> = {
  express: {
    name: "express",
    displayName: "Express.js",
    packageName: "express",
    entryFiles: [
      "src/index.ts",
      "src/index.js",
      "src/app.ts",
      "src/app.js",
      "src/server.ts",
      "src/server.js",
    ],
    port: 3000,
    language: "javascript",
  },
  fastify: {
    name: "fastify",
    displayName: "Fastify",
    packageName: "fastify",
    entryFiles: ["src/index.ts", "src/index.js", "src/app.ts", "src/app.js"],
    port: 3000,
    language: "javascript",
  },
  vanilla: {
    name: "vanilla",
    displayName: "Vanilla Node.js",
    packageName: "",
    entryFiles: ["src/index.ts", "src/index.js", "index.ts", "index.js"],
    port: 3000,
    language: "javascript",
  },
};

// Detection patterns for entry file validation
export const FRAMEWORK_PATTERNS: Record<Framework, RegExp[]> = {
  express: [/express\(\)/, /from\s+['"]express['"]/, /require\(['"]express['"]\)/],
  fastify: [/fastify\(\)/, /from\s+['"]fastify['"]/, /Fastify\(/],
  vanilla: [/createServer/, /from\s+['"]node:http['"]/, /require\(['"]http['"]\)/],
};
