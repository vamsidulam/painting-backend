const { z } = require("zod");

const updateServiceRequest = z
  .object({
    name: z.string().trim().min(2).max(200).optional(),
    cost: z.coerce.number().nonnegative().finite().optional(),
    description: z.string().trim().max(2000).optional(),
    category: z.enum(["interior", "exterior"]).optional(),
  })
  .refine(
    (v) =>
      v.name !== undefined ||
      v.cost !== undefined ||
      v.description !== undefined ||
      v.category !== undefined,
    { message: "Provide at least one of: name, cost, description, category" },
  );

module.exports = updateServiceRequest;
