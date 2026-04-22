const express = require("express");

const {
  listOrders,
  updateOrder,
  deleteOrder,
} = require("../services/ordermanagement");

const listOrdersQuery = require("../models/requests/listOrdersQuery");
const updateOrderRequest = require("../models/requests/updateOrderRequest");

const { validateBody, validateQuery } = require("../helpers/validation");
const { serializeOrder } = require("../models/responses/orderResponse");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.use(requireAdmin);

router.get("/", validateQuery(listOrdersQuery), async (req, res, next) => {
  try {
    const result = await listOrders(req.validated);
    res.json({
      success: true,
      data: {
        rows: result.rows.map(serializeOrder),
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

router.patch(
  "/:id",
  validateBody(updateOrderRequest),
  async (req, res, next) => {
    try {
      const order = await updateOrder({
        id: req.params.id,
        patch: req.validated,
        actor: req.user,
      });
      res.json({ success: true, data: { order: serializeOrder(order) } });
    } catch (err) {
      next(err);
    }
  },
);

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await deleteOrder({ id: req.params.id });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
