const Project = require("../../models/Project");
const { uploadImage, slugify } = require("../../helpers/upload");

async function createProject({ input, file, actor }) {
  const actorId = actor && actor.id ? actor.id : null;

  let imageUrl = "";
  if (file && file.buffer && file.buffer.length > 0) {
    const folder = `painting_services/projects/${slugify(input.name)}`;
    const publicId = `project_${Date.now()}`;
    const uploadResult = await uploadImage({
      buffer: file.buffer,
      folder,
      publicId,
      mimetype: file.mimetype,
      originalname: file.originalname,
    });
    imageUrl = uploadResult.secure_url || "";
  }

  const project = await Project.create({
    name: input.name,
    image: imageUrl,
    createdBy: actorId,
    updatedBy: actorId,
  });

  return project;
}

module.exports = createProject;
