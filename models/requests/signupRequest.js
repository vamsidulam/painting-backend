const { z } = require("zod");

const signupRequest = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits")
    .transform((v) => `+91${v}`),
  role: z.enum(["admin", "customer"]),
});

module.exports = signupRequest;
