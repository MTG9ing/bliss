// Existing Express template
export const expressLoggerTemplate = `import pino from "pino";
import pinoHttp from "pino-http";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: process.env.NODE_ENV !== "production" 
    ? { target: "pino-pretty", options: { colorize: true } }
    : undefined,
});

export const loggerMiddleware = pinoHttp({ logger });
`;

// New Fastify configuration template
export const fastifyLoggerTemplate = `// High-performance Pino configuration options for Fastify's native engine
export const loggerOptions = {
  level: process.env.LOG_LEVEL || "info",
  transport: process.env.NODE_ENV !== "production"
    ? {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
          colorize: true,
        },
      }
    : undefined,
};
`;