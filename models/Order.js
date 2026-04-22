const { Schema, model, models, Types } = require("mongoose");

const addressSchema = new Schema(
  {
    doorNumber: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const orderServiceSchema = new Schema(
  {
    id: { type: Types.ObjectId, ref: "Service", required: true },
    name: { type: String, required: true, trim: true },
    cost: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    category: {
      type: String,
      enum: ["interior", "exterior"],
      required: true,
      index: true,
    },
    service: { type: orderServiceSchema, required: true },
    propertyType: {
      type: String,
      enum: ["apartment", "villa", "building", "office"],
      required: true,
    },
    sqft: { type: Number, required: true, min: 1 },
    totalCost: { type: Number, required: true, min: 0 },
    address: { type: addressSchema, required: true },
    customer: { type: customerSchema, required: true },
    screenshotUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["requested", "accepted", "rejected"],
      default: "requested",
      index: true,
    },
    workStatus: {
      type: String,
      enum: ["pending", "started", "completed"],
      default: null,
      index: true,
    },
    updatedBy: { type: Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
    collection: "orders",
  },
);

orderSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = models.Order || model("Order", orderSchema);
