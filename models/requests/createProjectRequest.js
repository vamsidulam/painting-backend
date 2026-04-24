const { z } = require("zod");

const createProjectRequest = z.object({
  name: z.string().trim().min(2).max(200),
});

module.exports = createProjectRequest;
