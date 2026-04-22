const express = require("express");

const {
  listServices,
  createService,
  updateService,
  deleteService,
} = require("../services/servicemanagement");

const listServicesQuery = require("../models/requests/listServicesQuery");
const createServiceRequest = require("../models/requests/createServiceRequest");
const updateServiceRequest = require("../models/requests/updateServiceRequest");

const { validateBody, validateQuery } = require("../helpers/validation");
const { serializeService } = require("../models/responses/serviceResponse");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.use(requireAdmin);

router.get("/", validateQuery(listServicesQuery), async (req, res, next) => {
  try {
    const result = await listServices(req.validated);
    res.json({
      success: true,
      data: {
        rows: result.rows.map(serializeService),
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

router.post(
  "/",
  validateBody(createServiceRequest),
  async (req, res, next) => {
    try {
      const service = await createService({
        input: req.validated,
        actor: req.user,
      });
      res.status(201).json({
        success: true,
        data: { service: serializeService(service) },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  "/:id",
  validateBody(updateServiceRequest),
  async (req, res, next) => {
    try {
      const service = await updateService({
        id: req.params.id,
        patch: req.validated,
        actor: req.user,
      });
      res.json({
        success: true,
        data: { service: serializeService(service) },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await deleteService({ id: req.params.id });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
