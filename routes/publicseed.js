const express = require("express");
const { seedAdmin } = require("../services/seed");

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

module.exports = router;
