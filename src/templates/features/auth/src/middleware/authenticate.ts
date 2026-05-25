import { verifyToken } from "../lib/auth.js";

export function authenticate(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }

  req.user = payload;
  if (next) next();
}

export default authenticate;
