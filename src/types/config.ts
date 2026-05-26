import { z } from "zod";
import {
  FRAMEWORKS,
  type Framework,
  type Language,
  type PackageManager,
  type ProjectStructure,
  type ProjectType,
} from "./framework.ts";

// Zod v4: use z.enum with array cast to tuple
const FrameworkEnum = z.enum(FRAMEWORKS as [Framework, ...Framework[]]);

export const BlissConfigSchema = z.object({
  version: z.string().default("2.1.0"),
  project: z.object({
    name: z.string().min(1),
    type: z.enum(["starter", "backend", "library", "frontend"] as [ProjectType, ...ProjectType[]]),
    framework: FrameworkEnum,
    language: z
      .enum(["typescript", "javascript"] as [Language, ...Language[]])
      .default("typescript"),
    structure: z
      .enum(["standard", "mvc", "microservices", "oop", "functional", "hexagonal"] as [
        ProjectStructure,
        ...ProjectStructure[],
      ])
      .default("standard"),
    entryFile: z.string().default("src/index.ts"),
  }),
  packageManager: z
    .enum(["npm", "bun", "pnpm"] as [PackageManager, ...PackageManager[]])
    .default("bun"),
  features: z.array(z.string()).default([]),
  git: z
    .object({
      initialized: z.boolean().default(false),
      remote: z.string().optional(),
      url: z.string().optional(),
    })
    .default({}),
  github: z
    .object({
      username: z.string().optional(),
      authenticated: z.boolean().default(false),
    })
    .default({}),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type BlissConfig = z.infer<typeof BlissConfigSchema>;

export interface ProjectContext {
  cwd: string;
  config: BlissConfig;
}
