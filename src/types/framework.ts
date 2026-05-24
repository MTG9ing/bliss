export type Framework =
  | "express"
  | "fastify"
  | "hono"
  | "elysia"
  | "koa"
  | "vanilla";

export const FRAMEWORKS: Framework[] = [
  "express",
  "fastify",
  "hono",
  "elysia",
  "koa",
  "vanilla",
];

export interface FrameworkMeta {
  name: Framework;
  displayName: string;
  packageName: string;
  language: "typescript" | "javascript";
  hasRouter: boolean;
  defaultPort: number;
}

export const FRAMEWORK_META: Record<Framework, FrameworkMeta> = {
  express: {
    name: "express",
    displayName: "Express.js",
    packageName: "express",
    language: "javascript",
    hasRouter: true,
    defaultPort: 3000,
  },
  fastify: {
    name: "fastify",
    displayName: "Fastify",
    packageName: "fastify",
    language: "javascript",
    hasRouter: true,
    defaultPort: 3000,
  },
  hono: {
    name: "hono",
    displayName: "Hono",
    packageName: "hono",
    language: "typescript",
    hasRouter: true,
    defaultPort: 3000,
  },
  elysia: {
    name: "elysia",
    displayName: "Elysia",
    packageName: "elysia",
    language: "typescript",
    hasRouter: true,
    defaultPort: 3000,
  },
  koa: {
    name: "koa",
    displayName: "Koa",
    packageName: "koa",
    language: "javascript",
    hasRouter: true,
    defaultPort: 3000,
  },
  vanilla: {
    name: "vanilla",
    displayName: "Vanilla Node.js",
    packageName: "",
    language: "javascript",
    hasRouter: false,
    defaultPort: 3000,
  },
};