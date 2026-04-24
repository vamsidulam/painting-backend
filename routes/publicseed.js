const express = require("express");
const { seedAdmin, seedServiceCategories } = require("../services/seed");
const {
  serializeServiceCategory,
} = require("../models/responses/serviceCategoryResponse");

const router = express.Router();

router.post("/admin", async (_req, res, next) => {
  try {
    const { alreadyExisted, user } = await seedAdmin();
    res.status(alreadyExisted ? 200 : 201).json({
      success: true,
      alreadyExisted,
      message: alreadyExisted
        ? `Admin already exists for ${user.email}`
        : `Seeded admin ${user.email}`,
      data: { id: String(user._id), email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/service-categories", async (_req, res, next) => {
  try {
    const { created, skipped } = await seedServiceCategories();
    res.status(created.length > 0 ? 201 : 200).json({
      success: true,
      message: `Seeded ${created.length} categor${
        created.length === 1 ? "y" : "ies"
      }, ${skipped.length} already existed.`,
      data: {
        created: created.map(serializeServiceCategory),
        skipped: skipped.map(serializeServiceCategory),
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
