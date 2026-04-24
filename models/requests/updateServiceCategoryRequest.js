const { z } = require("zod");

const boolFromAny = z
  .union([z.boolean(), z.string()])
  .transform((v) => {
    if (typeof v === "boolean") return v;
    return v.toLowerCase() === "true" || v === "1";
  });

const updateServiceCategoryRequest = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().max(2000).optional(),
    isActive: boolFromAny.optional(),
    removeImage: boolFromAny.optional(),
  })
  .refine(
    (v) =>
      v.name !== undefined ||
      v.description !== undefined ||
      v.isActive !== undefined ||
      v.removeImage !== undefined,
    { message: "Provide at least one field to update" },
  );

module.exports = updateServiceCategoryRequest;
