import fastify from "fastify";

export const app = fastify({
  logger: true,
});

// Plugins
app.register(import("@fastify/sensible"));

// Routes
app.get("/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// Error handler (will be injected by bliss add errors)
// app.setErrorHandler(errorHandler);

export default app;
