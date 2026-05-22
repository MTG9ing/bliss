/**
 * Dynamically constructs a Zod validation schema file based on discovered .env keys
 */
export function generateEnvTemplate(discoveredKeys: string[]): string {
  // Fallback defaults if their .env is completely empty or missing
  const keys = discoveredKeys.length > 0 
    ? discoveredKeys 
    : ["NODE_ENV", "PORT", "JWT_SECRET", "DATABASE_URL"];

  const schemaFields = keys
    .map((key) => {
      if (key === "PORT") return `  PORT: z.string().default("3000").transform((v) => parseInt(v, 10)),`;
      if (key === "NODE_ENV") return `  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),`;
      return `  ${key}: z.string().min(1, "Environment variable '${key}' is required"),`;
    })
    .join("\n");

  return `import { z } from "zod";
import dotenv from "dotenv";

// Load raw entries from .env file disk stream
dotenv.config();

const envSchema = z.object({
${schemaFields}
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid Environment Configurations:");
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    process.exit(1);
  }

  return parsed.data;
}

export const env = validateEnv();
`;
}