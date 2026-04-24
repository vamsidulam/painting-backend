const { z } = require("zod");

const listServiceCategoriesQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().trim().max(200).optional().default(""),
  isActive: z.enum(["true", "false"]).optional(),
});

module.exports = listServiceCategoriesQuery;
