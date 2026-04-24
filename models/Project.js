const { Schema, model, models, Types } = require("mongoose");

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    image: { type: String, trim: true, default: "" },
    createdBy: { type: Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
    collection: "projects",
  },
);

projectSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = models.Project || model("Project", projectSchema);
