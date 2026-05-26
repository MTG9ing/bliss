import { join } from "node:path";
import MagicString from "magic-string";
import type { Framework } from "../types/framework.ts";
import { FRAMEWORK_PATTERNS } from "../types/framework.ts";
import { fileExists, readFile, writeFile } from "../utils/fs.ts";
import { logger } from "./logger.ts";

/**
 * Injection points for each framework
 * Where to insert imports, middleware, and routes
 */
const INJECTION_POINTS: Record<
  Framework,
  {
    import: { after: RegExp };
    middleware: { after: RegExp };
    routes: { before: RegExp };
  }
> = {
  express: {
    import: { after: /^(import\s+.*?from\s+['"][^'"]+['"];?\s*)+$/m },
    middleware: { after: /const\s+app\s*=\s*express\(\);?\s*\n/ },
    routes: { before: /app\.listen\s*\(/ },
  },
  fastify: {
    import: { after: /^(import\s+.*?from\s+['"][^'"]+['"];?\s*)+$/m },
    middleware: { after: /const\s+app\s*=\s*fastify\(\{[^}]*\}\);?\s*\n/ },
    routes: { before: /await\s+app\.listen\s*\(/ },
  },
  vanilla: {
    import: { after: /^(import\s+.*?from\s+['"][^'"]+['"];?\s*)+$/m },
    middleware: { after: /createServer\s*\(/ },
    routes: { before: /server\.listen\s*\(/ },
  },
};

/**
 * Feature import statements per framework
 */
const FEATURE_IMPORTS: Record<string, Record<Framework, string>> = {
  logger: {
    express: `import { requestLogger } from './middleware/request-logger.{ext}';`,
    fastify: `import { requestLogger } from './middleware/request-logger.{ext}';`,
    vanilla: `import { requestLogger } from './middleware/request-logger.{ext}';`,
  },
  errors: {
    express: `import { errorHandler } from './middleware/error-handler.{ext}';`,
    fastify: `import { errorHandler } from './middleware/error-handler.{ext}';`,
    vanilla: `import { errorHandler } from './middleware/error-handler.{ext}';`,
  },
  env: {
    express: `import { env } from './config/env.{ext}';`,
    fastify: `import { env } from './config/env.{ext}';`,
    vanilla: `import { env } from './config/env.{ext}';`,
  },
  cors: {
    express: `import cors from 'cors';`,
    fastify: `import cors from '@fastify/cors';`,
    vanilla: `// CORS handled manually in vanilla`,
  },
  security: {
    express: `import { securityMiddleware } from './middleware/security.{ext}';`,
    fastify: `import { securityMiddleware } from './middleware/security.{ext}';`,
    vanilla: `import { securityMiddleware } from './middleware/security.{ext}';`,
  },
  performance: {
    express: `import { performanceMiddleware } from './middleware/performance.{ext}';`,
    fastify: `import { performanceMiddleware } from './middleware/performance.{ext}';`,
    vanilla: `import { performanceMiddleware } from './middleware/performance.{ext}';`,
  },
  auth: {
    express: `import { authRoutes } from './routes/auth.{ext}';`,
    fastify: `import { authRoutes } from './routes/auth.{ext}';`,
    vanilla: `import { authRoutes } from './routes/auth.{ext}';`,
  },
};

/**
 * Feature middleware usage per framework
 */
const FEATURE_MIDDLEWARE: Record<string, Record<Framework, string>> = {
  logger: {
    express: `app.use(requestLogger);`,
    fastify: `app.addHook('onRequest', requestLogger);`,
    vanilla: `// requestLogger(req, res); // Add to request handler`,
  },
  errors: {
    express: `app.use(errorHandler);`,
    fastify: `app.setErrorHandler(errorHandler);`,
    vanilla: `// errorHandler(err, req, res); // Add to error handling`,
  },
  env: {
    express: `// env loaded — use env.PORT, env.DATABASE_URL, etc.`,
    fastify: `// env loaded — use env.PORT, env.DATABASE_URL, etc.`,
    vanilla: `// env loaded — use env.PORT, env.DATABASE_URL, etc.`,
  },
  cors: {
    express: `app.use(cors());`,
    fastify: `app.register(cors);`,
    vanilla: `// Add CORS headers manually`,
  },
  security: {
    express: `app.use(securityMiddleware);`,
    fastify: `app.register(securityMiddleware);`,
    vanilla: `// securityMiddleware(req, res); // Add to request handler`,
  },
  performance: {
    express: `app.use(performanceMiddleware);`,
    fastify: `app.register(performanceMiddleware);`,
    vanilla: `// performanceMiddleware(req, res); // Add to request handler`,
  },
  auth: {
    express: `app.use('/auth', authRoutes);`,
    fastify: `app.register(authRoutes, { prefix: '/auth' });`,
    vanilla: `// authRoutes(req, res); // Add to route handler`,
  },
};

/**
 * Manual instructions when auto-injection fails
 */
const MANUAL_INSTRUCTIONS: Record<string, Record<Framework, string>> = {
  logger: {
    express: `Add to your app setup:\n import { requestLogger } from './middleware/request-logger.{ext}';\n app.use(requestLogger);`,
    fastify: `Add to your app setup:\n import { requestLogger } from './middleware/request-logger.{ext}';\n app.addHook('onRequest', requestLogger);`,
    vanilla: `Add to your request handler:\n import { requestLogger } from './middleware/request-logger.{ext}';\n // Call requestLogger(req, res) in your handler`,
  },
  errors: {
    express: `Add to your app setup:\n import { errorHandler } from './middleware/error-handler.{ext}';\n app.use(errorHandler);`,
    fastify: `Add to your app setup:\n import { errorHandler } from './middleware/error-handler.{ext}';\n app.setErrorHandler(errorHandler);`,
    vanilla: `Add to your error handling:\n import { errorHandler } from './middleware/error-handler.{ext}';\n // Call errorHandler(err, req, res)`,
  },
  env: {
    express: `Add to your entry file:\n import { env } from './config/env.{ext}';\n // Use env.PORT, env.DATABASE_URL, etc.`,
    fastify: `Add to your entry file:\n import { env } from './config/env.{ext}';\n // Use env.PORT, env.DATABASE_URL, etc.`,
    vanilla: `Add to your entry file:\n import { env } from './config/env.{ext}';\n // Use env.PORT, env.DATABASE_URL, etc.`,
  },
  cors: {
    express: `Add to your app setup:\n import cors from 'cors';\n app.use(cors());`,
    fastify: `Add to your app setup:\n import cors from '@fastify/cors';\n app.register(cors);`,
    vanilla: `Add CORS headers manually to responses`,
  },
  security: {
    express: `Add to your app setup:\n import { securityMiddleware } from './middleware/security.{ext}';\n app.use(securityMiddleware);`,
    fastify: `Add to your app setup:\n import { securityMiddleware } from './middleware/security.{ext}';\n app.register(securityMiddleware);`,
    vanilla: `Add to your request handler:\n import { securityMiddleware } from './middleware/security.{ext}';\n // Call securityMiddleware(req, res)`,
  },
  performance: {
    express: `Add to your app setup:\n import { performanceMiddleware } from './middleware/performance.{ext}';\n app.use(performanceMiddleware);`,
    fastify: `Add to your app setup:\n import { performanceMiddleware } from './middleware/performance.{ext}';\n app.register(performanceMiddleware);`,
    vanilla: `Add to your request handler:\n import { performanceMiddleware } from './middleware/performance.{ext}';\n // Call performanceMiddleware(req, res)`,
  },
  auth: {
    express: `Add to your app setup:\n import { authRoutes } from './routes/auth.{ext}';\n app.use('/auth', authRoutes);`,
    fastify: `Add to your app setup:\n import { authRoutes } from './routes/auth.{ext}';\n app.register(authRoutes, { prefix: '/auth' });`,
    vanilla: `Add to your route handler:\n import { authRoutes } from './routes/auth.{ext}';\n // Call authRoutes(req, res) for /auth paths`,
  },
};

export interface InjectionResult {
  success: boolean;
  modified: string[];
  manualInstructions?: string;
}

/**
 * Escape regex special characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Get the file extension for imports based on language
 */
function getImportExt(isTypeScript: boolean): string {
  return isTypeScript ? "ts" : "js";
}

/**
 * Replace {ext} placeholder in template strings
 */
function resolveExt(template: string, isTypeScript: boolean): string {
  return template.replace(/\{ext\}/g, getImportExt(isTypeScript));
}

/**
 * Inject a feature into the project's entry file
 */
export function injectFeature(
  entryPath: string,
  featureId: string,
  framework: Framework,
  isTypeScript = true,
): InjectionResult {
  const content = readFile(entryPath);
  if (!content) {
    return {
      success: false,
      modified: [],
      manualInstructions: resolveExt(MANUAL_INSTRUCTIONS[featureId]?.[framework], isTypeScript),
    };
  }

  // Validate this is actually the right framework file
  const patterns = FRAMEWORK_PATTERNS[framework];
  const isValid = patterns.some((p) => p.test(content));
  if (!isValid) {
    logger.warn(`Entry file doesn't match ${framework} patterns`);
    return {
      success: false,
      modified: [],
      manualInstructions: resolveExt(MANUAL_INSTRUCTIONS[featureId]?.[framework], isTypeScript),
    };
  }

  const s = new MagicString(content);
  const points = INJECTION_POINTS[framework];

  // 1. Add import
  const importTemplate = FEATURE_IMPORTS[featureId]?.[framework];
  if (importTemplate) {
    const importCode = resolveExt(importTemplate, isTypeScript);
    const importMatch = points.import.after.exec(content);
    if (importMatch) {
      const insertPos = importMatch.index + importMatch[0].length;
      s.appendLeft(insertPos, `\n${importCode}\n`);
      logger.debug(`Injected import for ${featureId}`);
    } else {
      // Fallback: prepend to top of file (after shebang if present)
      const shebangMatch = content.match(/^#!.*\n/);
      const insertPos = shebangMatch ? shebangMatch[0].length : 0;
      s.appendLeft(insertPos, `${importCode}\n\n`);
      logger.debug(`Prepended import for ${featureId}`);
    }
  }

  // 2. Add middleware usage
  const middlewareCode = FEATURE_MIDDLEWARE[featureId]?.[framework];
  if (middlewareCode) {
    const middlewareMatch = points.middleware.after.exec(content);
    if (middlewareMatch) {
      const insertPos = middlewareMatch.index + middlewareMatch[0].length;
      s.appendLeft(insertPos, `\n${middlewareCode}\n`);
      logger.debug(`Injected middleware for ${featureId}`);
    }
  }

  // Write the modified file
  const modified = s.toString();
  const ok = writeFile(entryPath, modified);

  if (ok) {
    logger.success(`Injected ${featureId} into ${entryPath}`);
    return { success: true, modified: [entryPath] };
  }

  return {
    success: false,
    modified: [],
    manualInstructions: resolveExt(MANUAL_INSTRUCTIONS[featureId]?.[framework], isTypeScript),
  };
}

/**
 * Remove a feature from the project's entry file
 * Best-effort: removes import and middleware lines
 */
export function removeFeatureInjection(
  entryPath: string,
  featureId: string,
  framework: Framework,
  isTypeScript = true,
): InjectionResult {
  const content = readFile(entryPath);
  if (!content) {
    return { success: false, modified: [] };
  }

  const s = new MagicString(content);
  const importTemplate = FEATURE_IMPORTS[featureId]?.[framework];
  const middlewareCode = FEATURE_MIDDLEWARE[featureId]?.[framework];

  // Remove import line
  if (importTemplate) {
    const importCode = resolveExt(importTemplate, isTypeScript);
    const importRegex = new RegExp(`^.*${escapeRegExp(importCode)}.*$\n?`, "gm");
    s.replace(importRegex, "");
  }

  // Remove middleware line
  if (middlewareCode) {
    const middlewareRegex = new RegExp(`^.*${escapeRegExp(middlewareCode)}.*$\n?`, "gm");
    s.replace(middlewareRegex, "");
  }

  const ok = writeFile(entryPath, s.toString());
  return {
    success: ok,
    modified: ok ? [entryPath] : [],
  };
}

/**
 * Get manual instructions for a feature
 */
export function getManualInstructions(
  featureId: string,
  framework: Framework,
  isTypeScript = true,
): string | undefined {
  return resolveExt(MANUAL_INSTRUCTIONS[featureId]?.[framework], isTypeScript);
}
