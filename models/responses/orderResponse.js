function serializeOrder(order) {
  const plain = typeof order.toJSON === "function" ? order.toJSON() : order;
  return {
    id: plain.id || (plain._id ? String(plain._id) : undefined),
    category: plain.category,
    categoryId: plain.categoryId ? String(plain.categoryId) : null,
    service: plain.service
      ? {
          id: plain.service.id ? String(plain.service.id) : undefined,
          name: plain.service.name,
          cost: plain.service.cost,
        }
      : null,
    propertyType: plain.propertyType,
    sqft: plain.sqft,
    totalCost: plain.totalCost,
    address: plain.address,
    customer: plain.customer,
    screenshotUrl: plain.screenshotUrl,
    status: plain.status,
    workStatus: plain.workStatus,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

module.exports = { serializeOrder };
