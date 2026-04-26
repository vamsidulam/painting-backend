function serializeServiceCategory(category) {
  const plain =
    typeof category.toJSON === "function" ? category.toJSON() : category;
  return {
    id: plain.id || (plain._id ? String(plain._id) : undefined),
    name: plain.name,
    description: plain.description || "",
    image: plain.image || "",
    includesMoney:
      plain.includesMoney === undefined ? true : Boolean(plain.includesMoney),
    isActive: plain.isActive === undefined ? true : Boolean(plain.isActive),
    createdBy: plain.createdBy ? String(plain.createdBy) : null,
    updatedBy: plain.updatedBy ? String(plain.updatedBy) : null,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

function serializePublicServiceCategory(category) {
  const plain =
    typeof category.toJSON === "function" ? category.toJSON() : category;
  return {
    id: plain.id || (plain._id ? String(plain._id) : undefined),
    name: plain.name,
    description: plain.description || "",
    image: plain.image || "",
    includesMoney:
      plain.includesMoney === undefined ? true : Boolean(plain.includesMoney),
  };
}

module.exports = {
  serializeServiceCategory,
  serializePublicServiceCategory,
};
