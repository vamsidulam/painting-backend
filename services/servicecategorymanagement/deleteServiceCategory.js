const ServiceCategory = require("../../models/ServiceCategory");
const Service = require("../../models/Service");

async function deleteServiceCategory({ id }) {
  const category = await ServiceCategory.findById(id);
  if (!category) {
    const err = new Error("Category not found");
    err.status = 404;
    throw err;
  }

  const dependentCount = await Service.countDocuments({ categoryId: id });
  if (dependentCount > 0) {
    const err = new Error(
      `Cannot delete: ${dependentCount} service${
        dependentCount === 1 ? "" : "s"
      } still use this category. Reassign or remove them first.`,
    );
    err.status = 409;
    throw err;
  }

  await category.deleteOne();
  return { id: String(category._id) };
}

module.exports = deleteServiceCategory;
