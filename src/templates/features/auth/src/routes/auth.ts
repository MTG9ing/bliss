import { Router } from "express";
import { generateToken, authenticate, hashPassword } from "../lib/auth.js";

export const authRoutes = Router();

// Register
authRoutes.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    // TODO: Save user to database
    res.json({ success: true, message: "User registered" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Registration failed" });
  }
});

// Login
authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // TODO: Verify user from database
    const token = generateToken({ email });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

// Get current user
authRoutes.get("/me", authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default authRoutes;
