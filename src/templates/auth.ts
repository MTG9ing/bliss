export const expressAuthTemplate = `import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authGuard(roles: string[] = []) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: "fail", message: "Unauthorized access: Token missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
      req.user = decoded;

      if (roles.length > 0 && (!req.user.role || !roles.includes(req.user.role))) {
        return res.status(403).json({ status: "fail", message: "Forbidden access: Insufficient privileges" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ status: "fail", message: "Unauthorized access: Invalid or expired token" });
    }
  };
}
`;

export const fastifyAuthTemplate = `import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

export function createAuthGuard(roles: string[] = []) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      reply.status(401).send({ status: "fail", message: "Unauthorized access: Token missing" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
      (request as any).user = decoded;

      if (roles.length > 0 && (!(request as any).user.role || !roles.includes((request as any).user.role))) {
        reply.status(403).send({ status: "fail", message: "Forbidden access: Insufficient privileges" });
        return;
      }
    } catch (err) {
      reply.status(401).send({ status: "fail", message: "Unauthorized access: Invalid or expired token" });
    }
  };
}
`;