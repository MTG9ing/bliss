// Auth plugin for Fastify
import fp from "fastify-plugin";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";

declare module "fastify" {
  interface FastifyRequest {
    user?: object;
  }
}

export default fp(async (fastify) => {
  fastify.decorateRequest("user", null);

  fastify.addHook("onRequest", async (request) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return;

    const token = authHeader.slice(7);
    try {
      request.user = jwt.verify(token, JWT_SECRET) as object;
    } catch {
      // Invalid token, continue without user
    }
  });
});

export { jwt, bcrypt };