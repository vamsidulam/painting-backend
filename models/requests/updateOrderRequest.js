const { z } = require("zod");

const updateOrderRequest = z
  .object({
    status: z.enum(["requested", "accepted", "rejected"]).optional(),
    workStatus: z
      .enum(["pending", "started", "completed"])
      .nullable()
      .optional(),
  })
  .refine(
    (v) => v.status !== undefined || v.workStatus !== undefined,
    { message: "Provide at least one of: status, workStatus" },
  );

module.exports = updateOrderRequest;
