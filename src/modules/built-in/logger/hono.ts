// Logger setup for Hono
import { Hono } from "hono";
import { logger } from "hono/logger";

export const app = new Hono();

app.use("*", logger((msg: string) => {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}));