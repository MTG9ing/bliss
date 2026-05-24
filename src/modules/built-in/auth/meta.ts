import type { ModuleMeta } from "../../../types/modules.ts";

const meta: ModuleMeta = {
  id: "auth",
  name: "Authentication",
  description: "JWT-based authentication middleware",
  version: "2.0.0",
  author: "Bliss",
  tags: ["auth", "jwt", "security", "middleware"],
  frameworks: ["express", "fastify"],
  dependencies: ["jsonwebtoken", "bcryptjs"],
  devDependencies: ["@types/jsonwebtoken", "@types/bcryptjs"],
  files: [
    "src/lib/auth.ts",
    "src/middleware/authenticate.ts",
    "src/routes/auth.ts",
  ],
};

export default meta;