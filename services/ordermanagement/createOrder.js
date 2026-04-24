const Order = require("../../models/Order");
const { uploadImage, slugify } = require("../../helpers/cloudinary");

async function createOrder({ input, file }) {
  let screenshotUrl = "";

  if (file && file.buffer && file.buffer.length > 0) {
    const folder = `painting_services/${slugify(input.customer.name)}/photo`;
    const publicId = `screenshot_${Date.now()}`;
    const uploadResult = await uploadImage({
      buffer: file.buffer,
      folder,
      publicId,
    });
    screenshotUrl = uploadResult.secure_url;
  }

  const order = await Order.create({
    category: input.category,
    categoryId: input.categoryId || null,
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
    screenshotUrl,
    status: "requested",
    workStatus: null,
  });

  return order;
}

module.exports = createOrder;
