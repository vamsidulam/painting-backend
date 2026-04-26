const Service = require("../../models/Service");

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function listServices({
  page = 1,
  limit = 10,
  q = "",
  categoryId,
  workType,
}) {
  const filter = {};
  if (categoryId) filter.categoryId = categoryId;
  if (workType) filter.workType = workType;

  const trimmed = q ? q.trim() : "";
  if (trimmed) {
    const rx = new RegExp(escapeRegex(trimmed), "i");
    filter.$or = [{ name: rx }, { description: rx }];
  }

  const skip = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    Service.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("categoryId", "name image description isActive includesMoney"),
    Service.countDocuments(filter),
  ]);

  const pages = total === 0 ? 1 : Math.ceil(total / limit);

  return { rows, total, page, limit, pages };
}

module.exports = listServices;
