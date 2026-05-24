// Error handler for Hono
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export const app = new Hono();

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({
      success: false,
      error: {
        code: err.status,
        message: err.message,
      },
    }, err.status);
  }

  console.error("Unexpected error:", err);
  return c.json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  }, 500);
});