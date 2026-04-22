const Order = require("../../models/Order");
const { uploadImage, slugify } = require("../../helpers/cloudinary");

async function createOrder({ input, file }) {
  if (!file) {
    const err = new Error("Payment screenshot is required");
    err.status = 400;
    throw err;
  }

  const folder = `painting_services/${slugify(input.customer.name)}/photo`;
  const publicId = `screenshot_${Date.now()}`;

  const uploadResult = await uploadImage({
    buffer: file.buffer,
    folder,
    publicId,
  });

  const order = await Order.create({
    category: input.category,
    service: {
      id: input.service.id,
      name: input.service.name,
      cost: input.service.cost,
    },
    propertyType: input.propertyType,
    sqft: input.sqft,
    totalCost: input.totalCost,
    address: input.address,
    customer: input.customer,
    screenshotUrl: uploadResult.secure_url,
    status: "requested",
    workStatus: null,
  });

  return order;
}

module.exports = createOrder;
