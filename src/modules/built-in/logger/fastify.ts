// Logger setup for Fastify
import fp from "fastify-plugin";

export default fp(async (fastify) => {
  fastify.addHook("onRequest", async (request) => {
    request.log.info({ req: request.raw }, "incoming request");
  });

  fastify.addHook("onResponse", async (request, reply) => {
    request.log.info(
      { res: reply.raw, responseTime: reply.elapsedTime },
      "request completed"
    );
  });
});