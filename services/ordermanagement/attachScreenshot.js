const Order = require("../../models/Order");
const { uploadImage, slugify } = require("../../helpers/upload");

async function attachScreenshot({ id, file }) {
  if (!file || !file.buffer || file.buffer.length === 0) {
    const err = new Error("Payment screenshot is required");
    err.status = 400;
    throw err;
  }

  const order = await Order.findById(id);
  if (!order) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }

  const folder = `painting_services/${slugify(
    order.customer?.name || "order",
  )}/photo`;
  const publicId = `screenshot_${Date.now()}`;

  const uploadResult = await uploadImage({
    buffer: file.buffer,
    folder,
    publicId,
    mimetype: file.mimetype,
    originalname: file.originalname,
  });

  order.screenshotUrl = uploadResult.secure_url;
  await order.save();
  return order;
}

module.exports = attachScreenshot;
