const Service = require("../../models/Service");
const ServiceCategory = require("../../models/ServiceCategory");
const { uploadImage, slugify } = require("../../helpers/upload");

async function createService({ input, file, actor }) {
  const actorId = actor && actor.id ? actor.id : null;

  const category = await ServiceCategory.findById(input.categoryId);
  if (!category) {
    const err = new Error("Category not found");
    err.status = 400;
    throw err;
  }

  let imageUrl = "";
  if (file && file.buffer && file.buffer.length > 0) {
    const folder = `painting_services/services/${slugify(input.name)}`;
    const publicId = `service_${Date.now()}`;
    const uploadResult = await uploadImage({
      buffer: file.buffer,
      folder,
      publicId,
      mimetype: file.mimetype,
      originalname: file.originalname,
    });
    imageUrl = uploadResult.secure_url || "";
  }

  const service = await Service.create({
    name: input.name,
    cost: input.cost,
    description: input.description || "",
    image: imageUrl,
    workType: input.workType,
    categoryId: category._id,
    createdBy: actorId,
    updatedBy: actorId,
  });

  await service.populate(
    "categoryId",
    "name image description isActive includesMoney",
  );
  return service;
}

module.exports = createService;
