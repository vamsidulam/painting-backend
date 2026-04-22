const User = require("../../models/User");

async function me(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return { user };
}

module.exports = me;
