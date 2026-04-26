const Service = require("../../models/Service");
const ServiceCategory = require("../../models/ServiceCategory");
const { uploadImage, slugify } = require("../../helpers/upload");

async function updateService({ id, patch, file, actor }) {
  const service = await Service.findById(id);
  if (!service) {
    const err = new Error("Service not found");
    err.status = 404;
    throw err;
  }

  if (patch.name !== undefined) service.name = patch.name;
  if (patch.cost !== undefined) service.cost = patch.cost;
  if (patch.description !== undefined) service.description = patch.description;
  if (patch.workType !== undefined) service.workType = patch.workType;

  if (patch.categoryId !== undefined) {
    const category = await ServiceCategory.findById(patch.categoryId);
    if (!category) {
      const err = new Error("Category not found");
      err.status = 400;
      throw err;
    }
    service.categoryId = category._id;
  }

  if (patch.removeImage) {
    service.image = "";
  }

  if (file && file.buffer && file.buffer.length > 0) {
    const folder = `painting_services/services/${slugify(service.name)}`;
    const publicId = `service_${Date.now()}`;
    const uploadResult = await uploadImage({
      buffer: file.buffer,
      folder,
      publicId,
      mimetype: file.mimetype,
      originalname: file.originalname,
    });
    service.image = uploadResult.secure_url || "";
  }

  service.updatedBy = actor && actor.id ? actor.id : null;

  await service.save();
  await service.populate(
    "categoryId",
    "name image description isActive includesMoney",
  );
  return service;
}

module.exports = updateService;
