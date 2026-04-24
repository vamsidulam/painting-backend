function serializeProject(project) {
  const plain =
    typeof project.toJSON === "function" ? project.toJSON() : project;
  return {
    id: plain.id || (plain._id ? String(plain._id) : undefined),
    name: plain.name,
    image: plain.image || "",
    createdBy: plain.createdBy ? String(plain.createdBy) : null,
    updatedBy: plain.updatedBy ? String(plain.updatedBy) : null,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

function serializePublicProject(project) {
  const plain =
    typeof project.toJSON === "function" ? project.toJSON() : project;
  return {
    id: plain.id || (plain._id ? String(plain._id) : undefined),
    name: plain.name,
    image: plain.image || "",
  };
}

module.exports = { serializeProject, serializePublicProject };
