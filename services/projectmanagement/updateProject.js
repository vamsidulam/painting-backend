const Project = require("../../models/Project");
const { uploadImage, slugify } = require("../../helpers/upload");

async function updateProject({ id, patch, file, actor }) {
  const project = await Project.findById(id);
  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    throw err;
  }

  if (patch.name !== undefined) project.name = patch.name;

  if (patch.removeImage) {
    project.image = "";
  }

  if (file && file.buffer && file.buffer.length > 0) {
    const folder = `painting_services/projects/${slugify(project.name)}`;
    const publicId = `project_${Date.now()}`;
    const uploadResult = await uploadImage({
      buffer: file.buffer,
      folder,
      publicId,
      mimetype: file.mimetype,
      originalname: file.originalname,
    });
    project.image = uploadResult.secure_url || "";
  }

  project.updatedBy = actor && actor.id ? actor.id : null;
  await project.save();
  return project;
}

module.exports = updateProject;
