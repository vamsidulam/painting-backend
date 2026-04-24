const ServiceCategory = require("../../models/ServiceCategory");

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function listServiceCategories({
  page = 1,
  limit = 10,
  q = "",
  isActive,
}) {
  const filter = {};

  if (isActive === "true") filter.isActive = true;
  else if (isActive === "false") filter.isActive = false;

  const trimmed = q ? q.trim() : "";
  if (trimmed) {
    const rx = new RegExp(escapeRegex(trimmed), "i");
    filter.$or = [{ name: rx }, { description: rx }];
  }

  const skip = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    ServiceCategory.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ServiceCategory.countDocuments(filter),
  ]);

  const pages = total === 0 ? 1 : Math.ceil(total / limit);

  return { rows, total, page, limit, pages };
}

module.exports = listServiceCategories;
