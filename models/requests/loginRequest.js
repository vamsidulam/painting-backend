const { z } = require("zod");

const loginRequest = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

module.exports = loginRequest;
