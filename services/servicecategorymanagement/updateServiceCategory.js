const ServiceCategory = require("../../models/ServiceCategory");
const { uploadImage, slugify } = require("../../helpers/upload");

async function updateServiceCategory({ id, patch, file, actor }) {
  const category = await ServiceCategory.findById(id);
  if (!category) {
    const err = new Error("Category not found");
    err.status = 404;
    throw err;
  }

  if (patch.name !== undefined && patch.name !== category.name) {
    const clash = await ServiceCategory.findOne({
      _id: { $ne: category._id },
      name: new RegExp(`^${String(patch.name).trim()}$`, "i"),
    });
    if (clash) {
      const err = new Error("A category with this name already exists");
      err.status = 409;
      throw err;
    }
    category.name = patch.name;
  }
  if (patch.description !== undefined) category.description = patch.description;
  if (patch.includesMoney !== undefined)
    category.includesMoney = Boolean(patch.includesMoney);
  if (patch.isActive !== undefined) category.isActive = Boolean(patch.isActive);

  if (patch.removeImage) {
    category.image = "";
  }

  if (file && file.buffer && file.buffer.length > 0) {
    const folder = `painting_services/categories/${slugify(category.name)}`;
    const publicId = `category_${Date.now()}`;
    const uploadResult = await uploadImage({
      buffer: file.buffer,
      folder,
      publicId,
      mimetype: file.mimetype,
      originalname: file.originalname,
    });
    category.image = uploadResult.secure_url || "";
  }

  category.updatedBy = actor && actor.id ? actor.id : null;

  await category.save();
  return category;
}

module.exports = updateServiceCategory;
