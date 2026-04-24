const { z } = require("zod");

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const createOrderRequest = z.object({
  category: z.string().trim().min(1).max(100),
  categoryId: z
    .string()
    .trim()
    .regex(objectIdRegex, "categoryId must be a valid ObjectId")
    .optional(),
  service: z.object({
    id: z.string().min(1),
    name: z.string().trim().min(1).max(200),
    cost: z.coerce.number().nonnegative().finite(),
  }),
  propertyType: z.enum(["apartment", "villa", "building", "office"]),
  sqft: z.coerce.number().int().positive(),
  totalCost: z.coerce.number().nonnegative().finite(),
  address: z.object({
    doorNumber: z.string().trim().min(1).max(50),
    street: z.string().trim().min(1).max(200),
    city: z.string().trim().min(1).max(100),
    district: z.string().trim().min(1).max(100),
    state: z.string().trim().min(1).max(100),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  }),
  customer: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  }),
});

module.exports = createOrderRequest;
