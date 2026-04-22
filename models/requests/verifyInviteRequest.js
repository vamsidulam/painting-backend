const { z } = require("zod");

const verifyInviteRequest = z.object({
  token: z.string().min(10, "Token is required"),
});

module.exports = verifyInviteRequest;
