const { z } = require("zod");

const createServiceRequest = z.object({
  name: z.string().trim().min(2).max(200),
  cost: z.coerce.number().nonnegative().finite(),
  description: z.string().trim().max(2000).optional().default(""),
  category: z.enum(["interior", "exterior"]),
});

module.exports = createServiceRequest;
