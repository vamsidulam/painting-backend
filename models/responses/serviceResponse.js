function extractCategory(categoryField) {
  if (!categoryField) return { id: null, name: "" };
  if (typeof categoryField === "object") {
    if (categoryField._id || categoryField.id) {
      return {
        id: String(categoryField._id || categoryField.id),
        name: categoryField.name || "",
        image: categoryField.image || "",
        description: categoryField.description || "",
      };
    }
  }
  return { id: String(categoryField), name: "" };
}

function serializeService(service) {
  const plain =
    typeof service.toJSON === "function" ? service.toJSON() : service;
  const cat = extractCategory(plain.categoryId);
  return {
    id: plain.id || (plain._id ? String(plain._id) : undefined),
    name: plain.name,
    cost: plain.cost,
    description: plain.description || "",
    image: plain.image || "",
    workType: plain.workType || "fresh",
    categoryId: cat.id,
    category: cat.id
      ? {
          id: cat.id,
          name: cat.name,
          image: cat.image || "",
          description: cat.description || "",
        }
      : null,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
    createdBy: plain.createdBy ? String(plain.createdBy) : null,
    updatedBy: plain.updatedBy ? String(plain.updatedBy) : null,
  };
}

function serializePublicService(service) {
  const plain =
    typeof service.toJSON === "function" ? service.toJSON() : service;
  const cat = extractCategory(plain.categoryId);
  return {
    id: plain.id || (plain._id ? String(plain._id) : undefined),
    name: plain.name,
    cost: plain.cost,
    description: plain.description || "",
    image: plain.image || "",
    workType: plain.workType || "fresh",
    category: cat.name ? String(cat.name).toLowerCase() : "",
    categoryId: cat.id,
    categoryName: cat.name || "",
  };
}

module.exports = { serializeService, serializePublicService };
