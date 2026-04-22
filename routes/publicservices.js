const express = require("express");
const { z } = require("zod");

const listServices = require("../services/servicemanagement/listServices");
const { validateQuery } = require("../helpers/validation");
const { serializePublicService } = require("../models/responses/serviceResponse");

const publicServicesQuery = z.object({
  category: z.enum(["interior", "exterior"]).optional(),
});

const router = express.Router();

router.get("/", validateQuery(publicServicesQuery), async (req, res, next) => {
  try {
    const result = await listServices({
      page: 1,
      limit: 200,
      q: "",
      category: req.validated.category,
    });
    res.json({
      success: true,
      data: { services: result.rows.map(serializePublicService) },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
