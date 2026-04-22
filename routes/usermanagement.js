const express = require("express");

const {
  listUsers,
  updateUser,
  deleteUser,
} = require("../services/usermanagement");

const listUsersQuery = require("../models/requests/listUsersQuery");
const updateUserRequest = require("../models/requests/updateUserRequest");

const { validateBody, validateQuery } = require("../helpers/validation");
const { serializeUser } = require("../models/responses/authResponse");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.use(requireAdmin);

function listHandler(role) {
  return async (req, res, next) => {
    try {
      const result = await listUsers({ role, ...req.validated });
      res.json({
        success: true,
        data: {
          rows: result.rows.map(serializeUser),
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
  };
}

function updateHandler(role) {
  return async (req, res, next) => {
    try {
      const user = await updateUser({
        id: req.params.id,
        role,
        patch: req.validated,
        actor: req.user,
      });
      res.json({ success: true, data: { user: serializeUser(user) } });
    } catch (err) {
      next(err);
    }
  };
}

function deleteHandler(role) {
  return async (req, res, next) => {
    try {
      const result = await deleteUser({
        id: req.params.id,
        role,
        actor: req.user,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}

router.get(
  "/adminusers",
  validateQuery(listUsersQuery),
  listHandler("admin"),
);
router.patch(
  "/adminusers/:id",
  validateBody(updateUserRequest),
  updateHandler("admin"),
);
router.delete("/adminusers/:id", deleteHandler("admin"));

router.get(
  "/customers",
  validateQuery(listUsersQuery),
  listHandler("customer"),
);
router.patch(
  "/customers/:id",
  validateBody(updateUserRequest),
  updateHandler("customer"),
);
router.delete("/customers/:id", deleteHandler("customer"));

module.exports = router;
