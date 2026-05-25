import { logger } from "../lib/logger.js";

export function requestLogger(req: any, res: any, next: any) {
  const start = Date.now();

  res.on("finish", () => {
    logger.info({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: Date.now() - start,
    });
  });

  if (next) next();
}

export default requestLogger;
