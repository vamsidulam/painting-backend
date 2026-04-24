const { z } = require("zod");

const boolFromAny = z
  .union([z.boolean(), z.string()])
  .transform((v) => {
    if (typeof v === "boolean") return v;
    return v.toLowerCase() === "true" || v === "1";
  });

const updateProjectRequest = z
  .object({
    name: z.string().trim().min(2).max(200).optional(),
    removeImage: boolFromAny.optional(),
  })
  .refine(
    (v) => v.name !== undefined || v.removeImage !== undefined,
    { message: "Provide at least one field to update" },
  );

module.exports = updateProjectRequest;
