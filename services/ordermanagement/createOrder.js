const Order = require("../../models/Order");
const Service = require("../../models/Service");
const ServiceCategory = require("../../models/ServiceCategory");
const { uploadImage, slugify } = require("../../helpers/upload");
const {
  sendCustomerBookingConfirmation,
  sendAdminBookingNotification,
} = require("../../helpers/email");

const ADMIN_NOTIFICATION_EMAIL = "alamjmhir91@gmail.com";

async function sendBookingEmails({ order, includesMoney, workType }) {
  const payload = {
    customer: order.customer,
    category: order.category,
    service: order.service,
    workType,
    propertyType: order.propertyType,
    sqft: order.sqft,
    totalCost: order.totalCost,
    address: order.address,
    includesMoney,
    orderId: order.id || order._id,
  };

  await Promise.allSettled([
    (async () => {
      try {
        await sendCustomerBookingConfirmation({
          to: order.customer.email,
          ...payload,
        });
      } catch (err) {
        console.error("Failed to send customer booking email:", err.message);
      }
    })(),
    (async () => {
      try {
        await sendAdminBookingNotification({
          to: ADMIN_NOTIFICATION_EMAIL,
          ...payload,
        });
      } catch (err) {
        console.error("Failed to send admin booking email:", err.message);
      }
    })(),
  ]);
}

async function createOrder({ input, file }) {
  let screenshotUrl = "";

  if (file && file.buffer && file.buffer.length > 0) {
    const folder = `painting_services/${slugify(input.customer.name)}/photo`;
    const publicId = `screenshot_${Date.now()}`;
    const uploadResult = await uploadImage({
      buffer: file.buffer,
      folder,
      publicId,
      mimetype: file.mimetype,
      originalname: file.originalname,
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

  let includesMoney = true;
  let workType;
  try {
    if (input.categoryId) {
      const cat = await ServiceCategory.findById(input.categoryId).lean();
      if (cat && cat.includesMoney === false) includesMoney = false;
    }
    if (input.service && input.service.id) {
      const svc = await Service.findById(input.service.id).lean();
      if (svc && svc.workType) workType = svc.workType;
    }
  } catch (err) {
    console.error("Failed to enrich order for email:", err.message);
  }

  sendBookingEmails({ order, includesMoney, workType }).catch((err) => {
    console.error("Booking email batch failed:", err.message);
  });

  return order;
}

module.exports = createOrder;
