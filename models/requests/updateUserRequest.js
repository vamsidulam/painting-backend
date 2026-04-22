const { z } = require("zod");

const updateUserRequest = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    phone: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Phone must be exactly 10 digits")
      .transform((v) => `+91${v}`)
      .optional(),
  })
  .refine((v) => v.name !== undefined || v.phone !== undefined, {
    message: "Provide at least one of: name, phone",
  });

module.exports = updateUserRequest;
