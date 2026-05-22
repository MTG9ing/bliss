export const expressErrorTemplate = `import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export interface AppError extends Error {
  statusCode?: number;
}

export function globalErrorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Structured logging of the application exception path
  logger.error({
    err: {
      message: err.message,
      stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
    },
    request: {
      method: req.method,
      url: req.url,
    },
  }, "An unhandled exception was intercepted by the global boundary");

  res.status(statusCode).json({
    status: "fail",
    message: process.env.NODE_ENV === "production" && statusCode === 500
      ? "Something went wrong internally."
      : message,
  });
}
`;

export const fastifyErrorTemplate = `import { FastifyInstance } from "fastify";

export function registerGlobalErrorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || 500;
    
    request.log.error(error, "Fastify intercepted unhandled application error");

    reply.status(statusCode).send({
      status: "fail",
      message: process.env.NODE_ENV === "production" && statusCode === 500
        ? "Something went wrong internally."
        : error.message,
    });
  });
}
`;