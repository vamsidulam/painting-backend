const Order = require("../../models/Order");

async function updateOrder({ id, patch, actor }) {
  const order = await Order.findById(id);
  if (!order) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }

  if (patch.status !== undefined) order.status = patch.status;
  if (patch.workStatus !== undefined) order.workStatus = patch.workStatus;
  order.updatedBy = actor && actor.id ? actor.id : null;

  await order.save();
  return order;
}

module.exports = updateOrder;
