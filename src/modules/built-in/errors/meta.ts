import type { ModuleMeta } from "../../../types/modules.ts";

const meta: ModuleMeta = {
  id: "errors",
  name: "Error Handler",
  description: "Centralized error handling with custom error classes",
  version: "2.0.0",
  author: "Bliss",
  tags: ["errors", "middleware", "http"],
  frameworks: ["express", "fastify", "hono"],
  dependencies: [],
  devDependencies: [],
  files: [
    "src/lib/errors.ts",
    "src/middleware/error-handler.ts",
  ],
};

export default meta;