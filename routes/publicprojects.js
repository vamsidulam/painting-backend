const express = require("express");

const Project = require("../models/Project");
const {
  serializePublicProject,
} = require("../models/responses/projectResponse");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const rows = await Project.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: { projects: rows.map(serializePublicProject) },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
