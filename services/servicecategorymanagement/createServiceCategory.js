const ServiceCategory = require("../../models/ServiceCategory");
const { uploadImage, slugify } = require("../../helpers/upload");

async function createServiceCategory({ input, file, actor }) {
  const actorId = actor && actor.id ? actor.id : null;

  const existing = await ServiceCategory.findOne({
    name: new RegExp(`^${String(input.name).trim()}$`, "i"),
  });
  if (existing) {
    const err = new Error("A category with this name already exists");
    err.status = 409;
    throw err;
  }

  let imageUrl = "";
  if (file && file.buffer && file.buffer.length > 0) {
    const folder = `painting_services/categories/${slugify(input.name)}`;
    const publicId = `category_${Date.now()}`;
    const uploadResult = await uploadImage({
      buffer: file.buffer,
      folder,
      publicId,
      mimetype: file.mimetype,
      originalname: file.originalname,
    });
    imageUrl = uploadResult.secure_url || "";
  }

  const category = await ServiceCategory.create({
    name: input.name,
    description: input.description || "",
    image: imageUrl,
    isActive: input.isActive === undefined ? true : Boolean(input.isActive),
    createdBy: actorId,
    updatedBy: actorId,
  });

  return category;
}

module.exports = createServiceCategory;
