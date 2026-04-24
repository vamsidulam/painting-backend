const Project = require("../../models/Project");

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function listProjects({ page = 1, limit = 10, q = "" } = {}) {
  const filter = {};
  const trimmed = q ? q.trim() : "";
  if (trimmed) {
    const rx = new RegExp(escapeRegex(trimmed), "i");
    filter.name = rx;
  }

  const skip = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(filter),
  ]);

  const pages = total === 0 ? 1 : Math.ceil(total / limit);

  return { rows, total, page, limit, pages };
}

module.exports = listProjects;
