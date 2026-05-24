import type { ModuleMeta } from "../../../types/modules.ts";

const meta: ModuleMeta = {
  id: "env",
  name: "Environment Config",
  description: "Type-safe environment variable loading with validation",
  version: "2.0.0",
  author: "Bliss",
  tags: ["config", "env", "validation"],
  frameworks: ["express", "fastify", "hono", "elysia", "koa", "vanilla"],
  dependencies: ["dotenv", "zod"],
  devDependencies: [],
  files: [
    "src/config/env.ts",
  ],
};

export default meta;