const { z } = require("zod");

const boolFromAny = z
  .union([z.boolean(), z.string()])
  .transform((v) => {
    if (typeof v === "boolean") return v;
    return v.toLowerCase() === "true" || v === "1";
  });

const createServiceCategoryRequest = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(2000).optional().default(""),
  isActive: boolFromAny.optional().default(true),
});

module.exports = createServiceCategoryRequest;
