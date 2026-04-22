const { z } = require("zod");

const resetPasswordRequest = z.object({
  token: z.string().min(10, "Reset token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

module.exports = resetPasswordRequest;
