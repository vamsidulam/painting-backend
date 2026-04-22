function serializeService(service) {
  const plain =
    typeof service.toJSON === "function" ? service.toJSON() : service;
  return {
    id: plain.id || (plain._id ? String(plain._id) : undefined),
    name: plain.name,
    cost: plain.cost,
    description: plain.description || "",
    category: plain.category,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
    createdBy: plain.createdBy ? String(plain.createdBy) : null,
    updatedBy: plain.updatedBy ? String(plain.updatedBy) : null,
  };
}

function serializePublicService(service) {
  const plain =
    typeof service.toJSON === "function" ? service.toJSON() : service;
  return {
    id: plain.id || (plain._id ? String(plain._id) : undefined),
    name: plain.name,
    cost: plain.cost,
    description: plain.description || "",
    category: plain.category,
  };
}

module.exports = { serializeService, serializePublicService };
