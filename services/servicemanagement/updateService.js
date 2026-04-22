const Service = require("../../models/Service");

async function updateService({ id, patch, actor }) {
  const service = await Service.findById(id);
  if (!service) {
    const err = new Error("Service not found");
    err.status = 404;
    throw err;
  }

  if (patch.name !== undefined) service.name = patch.name;
  if (patch.cost !== undefined) service.cost = patch.cost;
  if (patch.description !== undefined) service.description = patch.description;
  if (patch.category !== undefined) service.category = patch.category;
  service.updatedBy = actor && actor.id ? actor.id : null;

  await service.save();
  return service;
}

module.exports = updateService;
