const { z } = require("zod");

const listOrdersQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().trim().max(200).optional().default(""),
  status: z.enum(["requested", "accepted", "rejected"]).optional(),
  workStatus: z.enum(["pending", "started", "completed"]).optional(),
  category: z.string().trim().min(1).max(100).optional(),
});

module.exports = listOrdersQuery;
