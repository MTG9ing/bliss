import { detectExpress } from "./express.ts";
import { detectFastify } from "./fastify.ts";
import { detectHono } from "./hono.ts";
import { detectElysia } from "./elysia.ts";
import { detectKoa } from "./koa.ts";
import { detectVanilla } from "./vanilla.ts";
import type { Framework } from "../types/framework.ts";

export function detectFramework(packageJson: { dependencies?: Record<string, string> }): Framework | null {
  if (detectExpress(packageJson)) return "express";
  if (detectFastify(packageJson)) return "fastify";
  if (detectHono(packageJson)) return "hono";
  if (detectElysia(packageJson)) return "elysia";
  if (detectKoa(packageJson)) return "koa";
  if (detectVanilla(packageJson)) return "vanilla";
  return null;
}

export * from "./express.ts";
export * from "./fastify.ts";
export * from "./hono.ts";
export * from "./elysia.ts";
export * from "./koa.ts";
export * from "./vanilla.ts";