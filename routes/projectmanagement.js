const express = require("express");
const multer = require("multer");

const {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../services/projectmanagement");

const listProjectsQuery = require("../models/requests/listProjectsQuery");
const createProjectRequest = require("../models/requests/createProjectRequest");
const updateProjectRequest = require("../models/requests/updateProjectRequest");

const { validateQuery } = require("../helpers/validation");
const { serializeProject } = require("../models/responses/projectResponse");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/^image\//.test(file.mimetype)) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

router.use(requireAdmin);

router.get("/", validateQuery(listProjectsQuery), async (req, res, next) => {
  try {
    const result = await listProjects(req.validated);
    res.json({
      success: true,
      data: {
        rows: result.rows.map(serializeProject),
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          pages: result.pages,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const payload = { name: req.body.name };
    const parsed = createProjectRequest.safeParse(payload);
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

    const project = await createProject({
      input: parsed.data,
      file: req.file,
      actor: req.user,
    });
    res.status(201).json({
      success: true,
      data: { project: serializeProject(project) },
    });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", upload.single("image"), async (req, res, next) => {
  try {
    const payload = {};
    if (req.body.name !== undefined) payload.name = req.body.name;
    if (req.body.removeImage !== undefined)
      payload.removeImage = req.body.removeImage;

    const hasAnyField = Object.keys(payload).length > 0 || !!req.file;
    if (!hasAnyField) {
      return res.status(400).json({
        success: false,
        error: "ValidationError",
        issues: [{ path: "", message: "Provide at least one field to update" }],
      });
    }

    const parsed = updateProjectRequest.safeParse(
      Object.keys(payload).length > 0 ? payload : { removeImage: false },
    );
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

    const project = await updateProject({
      id: req.params.id,
      patch: parsed.data,
      file: req.file,
      actor: req.user,
    });
    res.json({
      success: true,
      data: { project: serializeProject(project) },
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await deleteProject({ id: req.params.id });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
