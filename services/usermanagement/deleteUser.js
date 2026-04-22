const User = require("../../models/User");

async function deleteUser({ id, role, actor }) {
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

  if (actor && actor.id && String(user._id) === String(actor.id)) {
    const err = new Error("You cannot delete your own account");
    err.status = 400;
    throw err;
  }

  await user.deleteOne();
  return { id: String(user._id) };
}

module.exports = deleteUser;
