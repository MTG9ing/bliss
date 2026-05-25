import { Router } from "express";

export const router = Router();

router.get("/", (_req, res) => {
  res.json({
    name: "API",
    version: "1.0.0",
    status: "running",
  });
});

export default router;
