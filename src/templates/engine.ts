import Handlebars from "handlebars";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname, sep } from "node:path";
import type { ProjectContext } from "../types/index.ts";
import { logger } from "../core/logger.ts";
import { templateBundle, getTemplateContent } from "./bundle.ts";

// Register helpers
Handlebars.registerHelper("eq", (a, b) => a === b);
Handlebars.registerHelper("ne", (a, b) => a !== b);
Handlebars.registerHelper("and", (a, b) => a && b);
Handlebars.registerHelper("or", (a, b) => a || b);
Handlebars.registerHelper("lowercase", (str: string) => str.toLowerCase());
Handlebars.registerHelper("uppercase", (str: string) => str.toUpperCase());
Handlebars.registerHelper("camelcase", (str: string) => {
  return str.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
});

export interface TemplateContext {
  projectName: string;
  framework: string;
  language: string;
  port: number;
  features: {
    eslint: boolean;
    prettier: boolean;
    docker: boolean;
    tests: boolean;
  };
  packageManager: string;
}

export function buildTemplateContext(
  projectName: string,
  context: ProjectContext,
  features: TemplateContext["features"],
): TemplateContext {
  return {
    projectName,
    framework: context.framework,
    language: context.language,
    port: 3000,
    features,
    packageManager: context.packageManager,
  };
}

export function compileTemplate(content: string, data: TemplateContext): string {
  const template = Handlebars.compile(content);
  return template(data);
}

function getOutputName(templatePath: string): string {
  // Remove .hbs extension
  let name = templatePath.endsWith(".hbs") ? templatePath.slice(0, -4) : templatePath;
  
  // Handle dot-prefix files stored without the dot
  // Use sep for cross-platform path splitting
  const parts = name.split(sep);
  const basename = parts.pop() || name;
  
  const dotFiles: Record<string, string> = {
    "env.example": ".env.example",
    "gitignore": ".gitignore",
    "readme.md": "README.md",
  };
  
  if (dotFiles[basename]) {
    parts.push(dotFiles[basename]);
    return parts.join(sep);
  }
  
  return name;
}

export function processTemplateFile(
  srcPath: string,
  destPath: string,
  data: TemplateContext,
): void {
  const content = getTemplateContent(srcPath);
  if (!content) {
    logger.error(`Template not found in bundle: ${srcPath}`);
    throw new Error(`Template not found: ${srcPath}`);
  }
  const compiled = compileTemplate(content, data);

  const finalPath = getOutputName(destPath);
  mkdirSync(dirname(finalPath), { recursive: true });
  writeFileSync(finalPath, compiled.trim());
  logger.debug(`Generated ${finalPath}`);
}

export function scaffoldFromTemplate(
  templatePrefix: string,
  outputDir: string,
  data: TemplateContext,
): string[] {
  const generated: string[] = [];

  const templatePaths = Object.keys(templateBundle).filter((p) =>
    p.startsWith(templatePrefix + "/"),
  );

  if (templatePaths.length === 0) {
    logger.error(`No templates found for prefix: ${templatePrefix}`);
    return generated;
  }

  for (const templatePath of templatePaths) {
    const relPath = templatePath.slice(templatePrefix.length + 1);
    const destPath = join(outputDir, relPath);

    if (templatePath.endsWith(".hbs")) {
      try {
        processTemplateFile(templatePath, destPath, data);
        generated.push(getOutputName(destPath));
      } catch (err) {
        logger.error(`Failed to process template ${templatePath}: ${(err as Error).message}`);
      }
    } else {
      // Copy non-template files as-is from bundle
      try {
        const content = getTemplateContent(templatePath);
        if (content !== null) {
          mkdirSync(dirname(destPath), { recursive: true });
          writeFileSync(destPath, content);
          generated.push(destPath);
        }
      } catch (err) {
        logger.error(`Failed to copy ${templatePath}: ${(err as Error).message}`);
      }
    }
  }

  return generated;
}