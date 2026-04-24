const { z } = require("zod");

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const boolFromAny = z
  .union([z.boolean(), z.string()])
  .transform((v) => {
    if (typeof v === "boolean") return v;
    return v.toLowerCase() === "true" || v === "1";
  });

const updateServiceRequest = z
  .object({
    name: z.string().trim().min(2).max(200).optional(),
    cost: z.coerce.number().nonnegative().finite().optional(),
    description: z.string().trim().max(2000).optional(),
    workType: z.enum(["fresh", "repainting"]).optional(),
    categoryId: z
      .string()
      .trim()
      .regex(objectIdRegex, "categoryId must be a valid ObjectId")
      .optional(),
    removeImage: boolFromAny.optional(),
  })
  .refine(
    (v) =>
      v.name !== undefined ||
      v.cost !== undefined ||
      v.description !== undefined ||
      v.workType !== undefined ||
      v.categoryId !== undefined ||
      v.removeImage !== undefined,
    { message: "Provide at least one field to update" },
  );

module.exports = updateServiceRequest;
