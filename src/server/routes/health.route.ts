import { Router } from "express";
import redis from "../redis";

const router = Router();

router.use("/", async (req, res) => {
  const warnings = [];

  (!redis.isOpen || !redis.isReady) &&
    warnings.push("Redis is not connected or in invalid state.");

  res.status(warnings.length ? 500 : 200).json(warnings);
});

export default router;
