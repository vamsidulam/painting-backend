const User = require("../../models/User");

async function updateUser({ id, role, patch, actor }) {
  const user = await User.findById(id);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  if (user.role !== role) {
    const err = new Error("User does not match the requested role");
    err.status = 400;
    throw err;
  }

  if (patch.name !== undefined) user.name = patch.name;
  if (patch.phone !== undefined) user.phone = patch.phone;
  user.updatedBy = actor && actor.id ? actor.id : null;

  await user.save();
  return user;
}

module.exports = updateUser;
