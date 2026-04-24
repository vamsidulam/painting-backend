const express = require("express");
const multer = require("multer");

const {
  createOrder,
  attachScreenshot,
} = require("../services/ordermanagement");
const createOrderRequest = require("../models/requests/createOrderRequest");
const { serializeOrder } = require("../models/responses/orderResponse");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/^image\//.test(file.mimetype)) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

function safeParseJson(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

router.post("/", upload.single("screenshot"), async (req, res, next) => {
  try {
    const payload = {
      category: req.body.category,
      service: safeParseJson(req.body.service, {}),
      propertyType: req.body.propertyType,
      sqft: req.body.sqft,
      totalCost: req.body.totalCost,
      address: safeParseJson(req.body.address, {}),
      customer: safeParseJson(req.body.customer, {}),
    };

    const parsed = createOrderRequest.safeParse(payload);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: "ValidationError",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      });
    }

    const order = await createOrder({ input: parsed.data, file: req.file });
    res.status(201).json({
      success: true,
      data: { order: serializeOrder(order) },
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/:id/screenshot",
  upload.single("screenshot"),
  async (req, res, next) => {
    try {
      const order = await attachScreenshot({
        id: req.params.id,
        file: req.file,
      });
      res.json({ success: true, data: { order: serializeOrder(order) } });
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
