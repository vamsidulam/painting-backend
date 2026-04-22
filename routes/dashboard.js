const express = require("express");
const { z } = require("zod");

const {
  getStats,
  getOrderStatusCounts,
  getWorkStatusCounts,
  getRevenueOverTime,
  getOrdersPerPeriod,
} = require("../services/dashboard");

const { validateQuery } = require("../helpers/validation");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.use(requireAdmin);

router.get("/stats", async (_req, res, next) => {
  try {
    const data = await getStats();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get("/order-status", async (_req, res, next) => {
  try {
    const data = await getOrderStatusCounts();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get("/work-status", async (_req, res, next) => {
  try {
    const data = await getWorkStatusCounts();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

const revenueQuery = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30),
});

router.get(
  "/revenue-over-time",
  validateQuery(revenueQuery),
  async (req, res, next) => {
    try {
      const data = await getRevenueOverTime(req.validated);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
);

const ordersPerPeriodQuery = z.object({
  period: z.enum(["day", "week", "month", "year"]).default("day"),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
});

router.get(
  "/orders-per-period",
  validateQuery(ordersPerPeriodQuery),
  async (req, res, next) => {
    try {
      const data = await getOrdersPerPeriod(req.validated);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
