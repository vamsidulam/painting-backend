const { z } = require("zod");

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const createServiceRequest = z.object({
  name: z.string().trim().min(2).max(200),
  cost: z.coerce.number().nonnegative().finite(),
  description: z.string().trim().max(2000).optional().default(""),
  workType: z.enum(["fresh", "repainting"], {
    errorMap: () => ({ message: "workType must be 'fresh' or 'repainting'" }),
  }),
  categoryId: z
    .string()
    .trim()
    .regex(objectIdRegex, "categoryId must be a valid ObjectId"),
});

module.exports = createServiceRequest;
