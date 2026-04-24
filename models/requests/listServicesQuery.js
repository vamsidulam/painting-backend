const { z } = require("zod");

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const listServicesQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().trim().max(200).optional().default(""),
  categoryId: z
    .string()
    .trim()
    .regex(objectIdRegex, "categoryId must be a valid ObjectId")
    .optional(),
  workType: z.enum(["fresh", "repainting"]).optional(),
});

module.exports = listServicesQuery;
