import type { ModuleMeta } from "../../../types/modules.ts";

const meta: ModuleMeta = {
  id: "logger",
  name: "Structured Logger",
  description: "Pino-based structured logging with request tracing",
  version: "2.0.0",
  author: "Bliss",
  tags: ["logging", "observability", "middleware"],
  frameworks: ["express", "fastify", "hono"],
  dependencies: ["pino", "pino-pretty"],
  devDependencies: ["@types/pino"],
  files: [
    "src/lib/logger.ts",
    "src/middleware/request-logger.ts",
  ],
  postInstall: [
    "Add logger middleware to your app entry file",
  ],
};

export default meta;