const Project = require("../../models/Project");

async function deleteProject({ id }) {
  const project = await Project.findById(id);
  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    throw err;
  }
  await project.deleteOne();
  return { id: String(project._id) };
}

module.exports = deleteProject;
