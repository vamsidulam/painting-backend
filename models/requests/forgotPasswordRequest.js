const { z } = require("zod");

const forgotPasswordRequest = z.object({
  email: z.string().email(),
});

module.exports = forgotPasswordRequest;
