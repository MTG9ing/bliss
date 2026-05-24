// Error handler for Fastify
import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function fastifyErrorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);

  const statusCode = error.statusCode ?? 500;
  const message = statusCode >= 500 ? "Internal Server Error" : error.message;

  reply.status(statusCode).send({
    success: false,
    error: {
      code: error.code || "UNKNOWN_ERROR",
      message,
    },
  });
}