const Order = require("../../models/Order");

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function listOrders({
  page = 1,
  limit = 10,
  q = "",
  status,
  workStatus,
  category,
}) {
  const filter = {};
  if (status) filter.status = status;
  if (workStatus) filter.workStatus = workStatus;
  if (category) filter.category = category;

  const trimmed = q ? q.trim() : "";
  if (trimmed) {
    const rx = new RegExp(escapeRegex(trimmed), "i");
    filter.$or = [
      { "customer.name": rx },
      { "customer.email": rx },
      { "customer.phone": rx },
      { "service.name": rx },
      { "address.city": rx },
      { "address.pincode": rx },
    ];
  }

  const skip = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  const pages = total === 0 ? 1 : Math.ceil(total / limit);

  return { rows, total, page, limit, pages };
}

module.exports = listOrders;
