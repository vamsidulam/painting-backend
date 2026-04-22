const Order = require("../../models/Order");

async function deleteOrder({ id }) {
  const order = await Order.findById(id);
  if (!order) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }

  await order.deleteOne();
  return { id: String(order._id) };
}

module.exports = deleteOrder;
