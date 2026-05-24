// Request logger middleware
import { logger } from "../lib/logger.ts";

export function requestLogger(req: any, res: any, next: any) {
  const start = Date.now();
  res.on("finish", () => {
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: Date.now() - start,
    });
  });
  next();
}