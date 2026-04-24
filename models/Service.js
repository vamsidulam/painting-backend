const { Schema, model, models, Types } = require("mongoose");

const serviceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    cost: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
    workType: {
      type: String,
      enum: ["fresh", "repainting"],
      required: true,
      default: "fresh",
      index: true,
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
      index: true,
    },
    createdBy: { type: Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
    collection: "services",
  },
);

serviceSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = models.Service || model("Service", serviceSchema);
