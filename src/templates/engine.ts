import { join, dirname } from "node:path";
import { readdirSync } from "node:fs";
import { transform } from "sucrase";
import { writeFile, writeJson, ensureDir, readFile } from "../utils/fs.ts";
import { getTemplatePath } from "../utils/path.ts";
import type { Framework, Language, PackageManager } from "../types/framework.ts";
import { FRAMEWORK_META } from "../types/framework.ts";
import { logger } from "../core/logger.ts";

export interface TemplateContext {
  projectName: string;
  framework: Framework;
  language: Language;
  packageManager: PackageManager;
  features: string[];
  includeTests: boolean;
  includeGit: boolean;
}

export function renderTemplateFile(
  sourcePath: string,
  targetPath: string,
  language: Language
): boolean {
  const content = readFile(sourcePath);
  if (!content) return false;

  let processed = content;
  let finalPath = targetPath;

  if (language === "javascript") {
    try {
      processed = transform(content, {
        transforms: ["typescript"],
        preserveDynamicImport: true,
      }).code;

      processed = processed.replace(/from\s+['"]([^'"]+)\.ts['"]/g, `from '$1.js'`);
      processed = processed.replace(/import\s+['"]([^'"]+)\.ts['"]/g, `import '$1.js'`);

      finalPath = targetPath.replace(/\.ts$/, ".js");
    } catch (err) {
      logger.error(`Failed to transpile ${sourcePath}: ${(err as Error).message}`);
      return false;
    }
  }

  return writeFile(finalPath, processed);
}

export function copyTemplateDir(
  sourceDir: string,
  targetDir: string,
  language: Language
): boolean {
  try {
    ensureDir(targetDir);
    const entries = readdirSync(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = join(sourceDir, entry.name);
      const targetPath = join(targetDir, entry.name);

      if (entry.isDirectory()) {
        copyTemplateDir(sourcePath, targetPath, language);
      } else if (entry.name.endsWith(".ts")) {
        renderTemplateFile(sourcePath, targetPath, language);
      } else {
        const content = readFile(sourcePath);
        if (content) writeFile(targetPath, content);
      }
    }

    return true;
  } catch (err) {
    logger.error(`Failed to copy template: ${(err as Error).message}`);
    return false;
  }
}

export function scaffoldProject(targetDir: string, context: TemplateContext): boolean {
  logger.step(`Scaffolding ${context.framework} project: ${context.projectName}`);

  const baseDir = getTemplatePath("base");
  ensureDir(targetDir);
  copyTemplateDir(baseDir, targetDir, context.language);

  const frameworkDir = getTemplatePath(context.framework);
  const srcDir = join(targetDir, "src");
  ensureDir(srcDir);
  copyTemplateDir(frameworkDir, srcDir, context.language);

  const pkg = generatePackageJson(context);
  writeJson(join(targetDir, "package.json"), pkg);

  if (context.language === "typescript") {
    writeJson(join(targetDir, "tsconfig.json"), generateTsConfig());
  } else {
    writeJson(join(targetDir, "jsconfig.json"), generateJsConfig());
  }

  writeFile(join(targetDir, "README.md"), generateReadme(context));
  ensureDir(join(targetDir, ".bliss"));

  logger.success(`Project scaffolded at ${targetDir}`);
  return true;
}

export function copyFeatureTemplate(
  featureId: string,
  targetDir: string,
  language: Language
): boolean {
  const featureDir = getTemplatePath(join("features", featureId));
  logger.step(`Copying ${featureId} feature template`);

  const ok = copyTemplateDir(featureDir, join(targetDir, "src"), language);
  if (ok) {
    logger.success(`Copied ${featureId} files`);
  } else {
    logger.error(`Failed to copy ${featureId} files`);
  }
  return ok;
}

// ====== GENERATORS ======

function generatePackageJson(context: TemplateContext): Record<string, unknown> {
  const isTypeScript = context.language === "typescript";
  const mainFile = isTypeScript ? "dist/index.js" : "src/index.js";
  const ext = isTypeScript ? "ts" : "js";

  const pkg: Record<string, unknown> = {
    name: context.projectName,
    version: "1.0.0",
    description: `Backend API built with ${FRAMEWORK_META[context.framework].displayName}`,
    type: "module",
    main: mainFile,
    scripts: {
      dev: `${context.packageManager} run dev`,
      build: isTypeScript ? "tsc" : "echo 'No build step needed'",
      start: isTypeScript ? `node ${mainFile}` : `node src/index.${ext}`,
      test: "vitest",
      "test:ui": "vitest --ui",
      lint: "biome check .",
      "lint:fix": "biome check . --write",
      format: "biome format . --write",
    },
    dependencies: {},
    devDependencies: {
      vitest: "latest",
      "@biomejs/biome": "latest",
    },
  };

  const frameworkPkg = FRAMEWORK_META[context.framework].packageName;
  if (frameworkPkg) {
    (pkg.dependencies as Record<string, string>)[frameworkPkg] = "latest";
  }

  if (isTypeScript) {
    (pkg.devDependencies as Record<string, string>).typescript = "latest";
    (pkg.devDependencies as Record<string, string>)["@types/node"] = "latest";
    if (context.framework === "express") {
      (pkg.devDependencies as Record<string, string>)["@types/express"] = "latest";
    }
  }

  const featureDeps = getFeatureDependencies(context.features, context.framework);
  for (const dep of featureDeps.runtime) {
    (pkg.dependencies as Record<string, string>)[dep] = "latest";
  }
  for (const dep of featureDeps.dev) {
    (pkg.devDependencies as Record<string, string>)[dep] = "latest";
  }

  if (Object.keys(pkg.dependencies as Record<string, string>).length === 0) {
    delete pkg.dependencies;
  }

  return pkg;
}

function generateTsConfig(): Record<string, unknown> {
  return {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "bundler",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      outDir: "./dist",
      rootDir: "./src",
      baseUrl: ".",
      paths: { "~/*": ["src/*"] },
    },
    include: ["src/**/*", "tests/**/*"],
    exclude: ["node_modules", "dist"],
  };
}

function generateJsConfig(): Record<string, unknown> {
  return {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "bundler",
      baseUrl: ".",
      paths: { "~/*": ["src/*"] },
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"],
  };
}

function generateReadme(context: TemplateContext): string {
  const lines = [
    `# ${context.projectName}`,
    "",
    `Backend API built with ${FRAMEWORK_META[context.framework].displayName} and [Bliss CLI](https://github.com/MTG9ing/bliss).`,
    "",
    "## Features",
    "",
  ];

  if (context.features.length === 0) {
    lines.push("- Basic setup ready");
  } else {
    for (const feature of context.features) {
      lines.push(`- ${getFeatureDisplayName(feature)}`);
    }
  }

  lines.push(
    "",
    "## Getting Started",
    "",
    "```bash",
    `${context.packageManager} install`,
    `${context.packageManager} run dev`,
    `${context.packageManager} test`,
    "```",
    "",
    "## Scripts",
    "",
    "| Script | Command |",
    "|--------|---------|",
    `| dev | ${context.packageManager} run dev |`,
    `| build | ${context.packageManager} run build |`,
    `| start | ${context.packageManager} run start |`,
    `| test | ${context.packageManager} test |`,
    "",
    "---",
    "",
    "Built with [Bliss CLI](https://github.com/MTG9ing/bliss) ❤️",
    ""
  );

  return lines.join("\n");
}

function getFeatureDependencies(
  features: string[],
  framework: Framework
): { runtime: string[]; dev: string[] } {
  const runtime: string[] = [];
  const dev: string[] = [];

  const deps: Record<string, { runtime: string[]; dev: string[] }> = {
    logger: { runtime: ["pino", "pino-pretty"], dev: ["@types/pino"] },
    errors: { runtime: [], dev: [] },
    env: { runtime: ["dotenv", "zod"], dev: [] },
    cors: { runtime: framework === "fastify" ? ["@fastify/cors"] : ["cors"], dev: [] },
    security: { runtime: ["helmet", "express-rate-limit", "express-mongo-sanitize", "hpp"], dev: [] },
    performance: { runtime: ["compression"], dev: [] },
    auth: { runtime: ["jsonwebtoken", "bcryptjs"], dev: ["@types/jsonwebtoken", "@types/bcryptjs"] },
  };

  for (const feature of features) {
    const featureDeps = deps[feature];
    if (featureDeps) {
      runtime.push(...featureDeps.runtime);
      dev.push(...featureDeps.dev);
    }
  }

  return { runtime, dev };
}

function getFeatureDisplayName(featureId: string): string {
  const names: Record<string, string> = {
    logger: "Structured logging with Pino",
    errors: "Centralized error handling",
    env: "Environment configuration with Zod",
    cors: "CORS middleware",
    security: "Security headers & rate limiting",
    performance: "Performance optimization",
    auth: "JWT authentication",
  };
  return names[featureId] || featureId;
}