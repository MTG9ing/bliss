// Auth routes
import { Router } from "express";
import { generateToken, authenticate } from "../lib/auth.ts";

export const authRoutes = Router();

authRoutes.post("/login", (req, res) => {
  // Login logic here
  res.json({ token: generateToken({ id: 1 }) });
});

authRoutes.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});