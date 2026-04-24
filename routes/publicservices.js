const express = require("express");
const { z } = require("zod");

const listServices = require("../services/servicemanagement/listServices");
const ServiceCategory = require("../models/ServiceCategory");
const { validateQuery } = require("../helpers/validation");
const {
  serializePublicService,
} = require("../models/responses/serviceResponse");
const {
  serializePublicServiceCategory,
} = require("../models/responses/serviceCategoryResponse");

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const publicServicesQuery = z.object({
  category: z.string().trim().min(1).max(100).optional(),
  categoryId: z
    .string()
    .trim()
    .regex(objectIdRegex, "categoryId must be a valid ObjectId")
    .optional(),
  workType: z.enum(["fresh", "repainting"]).optional(),
});

const router = express.Router();

router.get("/", validateQuery(publicServicesQuery), async (req, res, next) => {
  try {
    let categoryId = req.validated.categoryId;
    if (!categoryId && req.validated.category) {
      const cat = await ServiceCategory.findOne({
        name: new RegExp(`^${String(req.validated.category).trim()}$`, "i"),
        isActive: true,
      });
      if (!cat) {
        return res.json({ success: true, data: { services: [] } });
      }
      categoryId = String(cat._id);
    }

    const result = await listServices({
      page: 1,
      limit: 200,
      q: "",
      categoryId,
      workType: req.validated.workType,
    });
    res.json({
      success: true,
      data: { services: result.rows.map(serializePublicService) },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/categories", async (_req, res, next) => {
  try {
    const categories = await ServiceCategory.find({ isActive: true }).sort({
      name: 1,
    });
    res.json({
      success: true,
      data: {
        categories: categories.map(serializePublicServiceCategory),
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
