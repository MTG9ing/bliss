import { readFile, access } from "node:fs/promises"; 
import { join, relative, dirname } from "node:path";
import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import yocto from "yoctocolors";
import { loadConfig, saveConfig } from "../engines/config";
import { installPackages } from "../engines/installer";
import { createFileFromTemplate, injectMiddlewareIntoFile } from "../engines/injector";
import { expressLoggerTemplate, fastifyLoggerTemplate } from "../templates/logger";
import { expressErrorTemplate, fastifyErrorTemplate } from "../templates/errors";
import { expressAuthTemplate, fastifyAuthTemplate } from "../templates/auth";
import { generateEnvTemplate } from "../templates/env";

export default defineCommand({
  meta: {
    name: "boost",
    description: "Inject high-performance modules into an existing backend",
  },
  async run() {
    p.intro(yocto.bgCyan(yocto.black(" bliss boost ")));

    // 1. Establish project configuration foundation
    const config = await loadConfig();
    if (!config) {
      p.cancel(yocto.red("Error: No bliss.json configuration found in this workspace root."));
      return;
    }

    // 2. Capture architectural optimization selection
    const moduleType = await p.select({
      message: "Which architectural layer do you want to optimize?",
      options: [
        { value: "logger", label: "Structured Logger (Pino)", hint: "High-performance async tracking" },
        { value: "errors", label: "Global Error Handler", hint: "Centralized error handling middleware" },
        { value: "auth", label: "JWT Auth Guard", hint: "Token validation & role restrictions" },
        { value: "env", label: "Type-Safe Env Loader", hint: "Fail-fast runtime .env validation via Zod" }, 
      ],
    });

    if (p.isCancel(moduleType)) {
      p.cancel("Operation aborted.");
      return;
    }

    // NEW: Check if the module is already installed
    if (config.modulesInstalled.includes(moduleType as string)) {
      p.cancel(yocto.yellow(`The ${moduleType} module has already been injected into this project!`));
      return;
    }

    // ==========================================
    // EXECUTION PIPELINE: LOGGER OPTIMIZATION
    // ==========================================
    if (moduleType === "logger") {
      const extension = config.language === "typescript" ? "ts" : "js";
      
      // Step A: Package Dependency Synchronizer
      const sDeps = p.spinner();
      sDeps.start(`Installing pino production dependencies via ${config.packageManager}...`);
      const depsSuccess = await installPackages(config.packageManager, ["pino", "pino-http"]);
      if (!depsSuccess) {
        sDeps.stop(yocto.red("Package manager execution failed."));
        return;
      }
      sDeps.stop(yocto.green("Dependencies synchronized successfully."));

      // Step B: Structural File Creation Layer
      const sFile = p.spinner();
      sFile.start("Generating modular logger utility layout...");

      // 1. Resolve which file content blueprint to use
      const templateToUse = config.architecture.framework === "fastify" 
        ? fastifyLoggerTemplate 
        : expressLoggerTemplate;

      // Resolve paths cleanly based on their real bliss.json properties
      const targetUtilFile = join(process.cwd(), config.paths.utilsDir, `logger.${extension}`);

      // 2. Pass the dynamically selected blueprint here
      await createFileFromTemplate(targetUtilFile, templateToUse);

      await new Promise((r) => setTimeout(r, 400));
      sFile.stop(yocto.green(`Utility created at: ${config.paths.utilsDir}/logger.${extension}`));

      // Step C: Surgical Entry Point Modification
      const sInject = p.spinner();
      sInject.start(`Injecting active middleware streams into entry point...`);

      const entryFile = join(process.cwd(), config.paths.entryPoint);

      // 1. DYNAMIC ANCHOR & BLUEPRINT RESOLUTION
      let anchor = "";
      let codeToInject = "";

      const framework = config.architecture.framework;

      if (framework === "express") {
        anchor = "express()";
        codeToInject = `\n// Injected by Bliss Engine\nimport { loggerMiddleware } from "./utils/logger";\napp.use(loggerMiddleware);`;
      } else if (framework === "fastify") {
        anchor = "fastify("; 
        // Fastify takes logger configurations right inside its factory constructor configuration block
        codeToInject = `\n// Injected by Bliss Engine\nimport { loggerOptions } from "./utils/logger";\n// NOTE: Ensure you add 'logger: loggerOptions' inside your fastify() initialization arguments below!\n`;
      } else {
        // Vanilla Node.js HTTP Server fallback
        anchor = "createServer(";
        codeToInject = `\n// Injected by Bliss Engine\nimport { logger } from "./utils/logger";\n`;
      }

      // 2. TRIGGER THE MUTATOR WITH ADAPTED STRATEGY
      const injectSuccess = await injectMiddlewareIntoFile({
        filePath: entryFile,
        anchor: anchor, 
        toInject: codeToInject,
      });

      await new Promise((r) => setTimeout(r, 400));

      if (!injectSuccess) {
        sInject.stop(yocto.yellow("Surgical file mutation skipped."));
        p.note(
          `We generated your logger file, but could not locate the exact initialization anchor "${anchor}" inside ${yocto.cyan(config.paths.entryPoint)}.\n` +
          `Please manually register the logger middleware component inside your main script.`,
          "Anchor Mapping Notice"
        );
      } else {
        sInject.stop(yocto.green("Entry point code base successfully mutated."));
        
        // NEW: Update configuration state array and persist to disk
        config.modulesInstalled.push("logger");
        await saveConfig(config);
      }
    }

    // ==========================================
    // EXECUTION PIPELINE: ERROR HANDLER OPTIMIZATION
    // ==========================================
    if (moduleType === "errors") {
      const extension = config.language === "typescript" ? "ts" : "js";

      // Step A: Structural File Creation Layer
      const sFile = p.spinner();
      sFile.start("Generating centralized error handler layout...");

      const templateToUse = config.architecture.framework === "fastify"
        ? fastifyErrorTemplate
        : expressErrorTemplate;

      const targetUtilFile = join(process.cwd(), config.paths.utilsDir, `errors.${extension}`);
      await createFileFromTemplate(targetUtilFile, templateToUse);

      await new Promise((r) => setTimeout(r, 400));
      sFile.stop(yocto.green(`Middleware created at: ${config.paths.utilsDir}/errors.${extension}`));

      // Step B: Surgical Entry Point Modification
      const sInject = p.spinner();
      sInject.start(`Injecting global error boundaries into entry point...`);

      const entryFile = join(process.cwd(), config.paths.entryPoint);

      let anchor = "";
      let codeToInject = "";

      const framework = config.architecture.framework;

      if (framework === "express") {
        // Express error handling middleware MUST be registered at the very bottom of the middleware stack
        // So we anchor onto their listen() call or server startup trigger
        anchor = "app.listen("; 
        codeToInject = `\n// Injected Centralized Error Boundary\nimport { globalErrorHandler } from "./utils/errors";\napp.use(globalErrorHandler);\n`;
      } else if (framework === "fastify") {
        anchor = "fastify(";
        codeToInject = `\n// Injected Centralized Error Boundary\nimport { registerGlobalErrorHandler } from "./utils/errors";\nregisterGlobalErrorHandler(app);\n`;
      } else {
        anchor = "createServer(";
        codeToInject = `\n// Setup global node uncaught exception tracking rules\nprocess.on("uncaughtException", (err) => console.error(err));\n`;
      }

      const injectSuccess = await injectMiddlewareIntoFile({
        filePath: entryFile,
        anchor: anchor, 
        toInject: codeToInject,
        // Express needs the middleware REGISTERED BEFORE app.listen triggers!
        position: framework === "express" ? "before" : "after", 
      });

      await new Promise((r) => setTimeout(r, 400));

      if (!injectSuccess) {
        sInject.stop(yocto.yellow("Surgical entry point modification skipped."));
        p.note(
          `We generated your error handling files, but could not locate "${anchor}" inside ${yocto.cyan(config.paths.entryPoint)}.\n` +
          `Please manually register the error middleware at the bottom of your routes loop.`,
          "Anchor Mapping Notice"
        );
      } else {
        sInject.stop(yocto.green("Global error parameters bound successfully into runtime code base."));
        
        config.modulesInstalled.push("errors");
        await saveConfig(config);
      }
    }

    // ==========================================
    // EXECUTION PIPELINE: AUTH GUARD OPTIMIZATION
    // ==========================================
    if (moduleType === "auth") {
      const extension = config.language === "typescript" ? "ts" : "js";

      // Step A: Package Dependency Synchronizer
      const sDeps = p.spinner();
      sDeps.start(`Installing cryptographic authentication dependencies via ${config.packageManager}...`);
      
      const packages = ["jsonwebtoken"];
      if (config.language === "typescript") {
        packages.push("@types/jsonwebtoken");
      }

      const depsSuccess = await installPackages(config.packageManager, packages);
      if (!depsSuccess) {
        sDeps.stop(yocto.red("Package manager execution failed."));
        return;
      }
      sDeps.stop(yocto.green("Authentication dependencies synchronized successfully."));

      // Step B: Structural File Creation Layer
      const sFile = p.spinner();
      sFile.start("Generating authorization middleware layout...");

      const templateToUse = config.architecture.framework === "fastify"
        ? fastifyAuthTemplate
        : expressAuthTemplate;

      const targetUtilFile = join(process.cwd(), config.paths.utilsDir, `auth.${extension}`);
      await createFileFromTemplate(targetUtilFile, templateToUse);

      await new Promise((r) => setTimeout(r, 400));
      sFile.stop(yocto.green(`Guard created at: ${config.paths.utilsDir}/auth.${extension}`));

      // Step C: Informative Setup Confirmation
      p.note(
        `Security Guard generated! To enforce this module inside your routes, import it and apply it:\n\n` +
        `• Express: app.get("/admin", authGuard(["admin"]), routeHandler);\n` +
        `• Fastify: fastify.get("/admin", { preHandler: [createAuthGuard(["admin"])] }, routeHandler);`,
        "Route Guards Integration Guidelines"
      );

      config.modulesInstalled.push("auth");
      await saveConfig(config);
    }

    // ==========================================
    // EXECUTION PIPELINE: TYPE-SAFE ENV LOADER
    // ==========================================
    if (moduleType === "env") {
      const extension = config.language === "typescript" ? "ts" : "js";

      // Step A: Install Validation Dependencies
      const sDeps = p.spinner();
      sDeps.start(`Installing validation frameworks via ${config.packageManager}...`);
      const depsSuccess = await installPackages(config.packageManager, ["zod", "dotenv"]);
      if (!depsSuccess) {
        sDeps.stop(yocto.red("Package manager initialization failed."));
        return;
      }
      sDeps.stop(yocto.green("Validation toolchains installed."));

      // Step B: Scan for Existing .env Keys
      const sScan = p.spinner();
      sScan.start("Scanning workspace for existing .env blueprints...");
      
      let discoveredKeys: string[] = [];
      const envPath = join(process.cwd(), ".env");
      
      try {
        const rawEnv = await readFile(envPath, "utf-8");
        discoveredKeys = rawEnv
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line && !line.startsWith("#") && line.includes("="))
          .map((line) => line.split("=")[0].trim());
      } catch {
        // Fall back gracefully to standard defaults if no .env file exists
      }
      sScan.stop(yocto.green(`Discovered ${discoveredKeys.length} active env parameters.`));

      // Step C: Create runtime configuration module
      const sFile = p.spinner();
      sFile.start("Compiling strict validation runtime engine...");

      const generatedTemplate = generateEnvTemplate(discoveredKeys);
      const targetUtilFile = join(process.cwd(), config.paths.envConfig);

      await createFileFromTemplate(targetUtilFile, generatedTemplate);
      sFile.stop(yocto.green(`Validation module persisted: ${config.paths.envConfig}`));

      // Step D: Surgical Injection into Entry Point
      const sInject = p.spinner();
      sInject.start("Binding validation listener to server bootstrap layer...");

      const entryFile = join(process.cwd(), config.paths.entryPoint);
      const absoluteEnvConfigPath = join(process.cwd(), config.paths.envConfig);
      
      // Calculate the exact relative path from the entry file's directory to the env file
      let relativeImportPath = relative(dirname(entryFile), absoluteEnvConfigPath);
      
      // Normalize paths across operating systems and ensure it starts with a clean dot-slash
      relativeImportPath = relativeImportPath.replace(/\\/g, "/");
      if (!relativeImportPath.startsWith(".")) {
        relativeImportPath = "./" + relativeImportPath;
      }
      // Strip out the file extension (.ts/.js) for standard ESM imports
      relativeImportPath = relativeImportPath.replace(/\.(ts|js)$/, "");

      const codeToInject = `\n// Validate core environment settings instantly on startup\nimport "${relativeImportPath}";\n`;

      const injectSuccess = await injectMiddlewareIntoFile({
        filePath: entryFile,
        anchor: config.architecture.framework === "express" ? "express()" : "fastify(",
        position: "before", 
        toInject: codeToInject, // Pass your new calculated string
      });

      if (!injectSuccess) {
        sInject.stop(yocto.yellow("Entry point insertion skipped."));
        p.note(`Please add 'import "./configurations/env";' at the absolute top line of your entry file.`);
      } else {
        sInject.stop(yocto.green("Fail-fast validation successfully bound to startup routine."));
        
        // Update state flags inside configuration blueprint
        config.upgrades.centralizedEnv = true;
        config.modulesInstalled.push("env");
        await saveConfig(config);
      }
    }

    p.outro(yocto.bgGreen(yocto.black(" Core Optimization Pipeline Complete! ")));
  },
});