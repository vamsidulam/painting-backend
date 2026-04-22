const { z } = require("zod");

const listServicesQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().trim().max(200).optional().default(""),
  category: z.enum(["interior", "exterior"]).optional(),
});

module.exports = listServicesQuery;
