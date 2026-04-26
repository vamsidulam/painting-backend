const { Schema, model, models, Types } = require("mongoose");

const serviceCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    description: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
    includesMoney: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: { type: Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
    collection: "servicecategories",
  },
);

serviceCategorySchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports =
  models.ServiceCategory || model("ServiceCategory", serviceCategorySchema);
