const Service = require("../../models/Service");

async function deleteService({ id }) {
  const service = await Service.findById(id);
  if (!service) {
    const err = new Error("Service not found");
    err.status = 404;
    throw err;
  }

  await service.deleteOne();
  return { id: String(service._id) };
}

module.exports = deleteService;
