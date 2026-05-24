import { z } from "zod";
import { FRAMEWORKS, type Framework } from "./framework.ts";

// Convert array to tuple for z.enum (Zod v4 requirement)
const FRAMEWORK_TUPLE = [
  FRAMEWORKS[0],
  ...FRAMEWORKS.slice(1),
] as [Framework, ...Framework[]];

export const BlissConfigSchema = z.object({
  version: z.string().default("2.0.0"),
  framework: z.enum(FRAMEWORK_TUPLE),
  language: z.enum(["typescript", "javascript"]).default("typescript"),
  modules: z.array(z.string()).default([]),
  port: z.number().int().min(1).max(65535).default(3000),
  features: z
    .object({
      eslint: z.boolean().default(false),
      prettier: z.boolean().default(false),
      docker: z.boolean().default(false),
      tests: z.boolean().default(false),
    })
    .default({}),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type BlissConfig = z.infer<typeof BlissConfigSchema>;

export interface ProjectContext {
  cwd: string;
  framework: Framework;
  language: "typescript" | "javascript";
  hasTypeScript: boolean;
  packageManager: "npm" | "yarn" | "pnpm" | "bun";
  config?: BlissConfig;
}