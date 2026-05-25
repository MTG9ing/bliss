import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform(Number).default("3000"),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(1).default("change-me-in-production"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;

export default env;
