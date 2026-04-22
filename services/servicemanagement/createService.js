const Service = require("../../models/Service");

async function createService({ input, actor }) {
  const actorId = actor && actor.id ? actor.id : null;

  const service = await Service.create({
    name: input.name,
    cost: input.cost,
    description: input.description || "",
    category: input.category,
    createdBy: actorId,
    updatedBy: actorId,
  });

  return service;
}

module.exports = createService;
