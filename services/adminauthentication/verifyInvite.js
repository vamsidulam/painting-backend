const User = require("../../models/User");
const { verifyToken } = require("../../helpers/jwt");

async function verifyInvite({ token }) {
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    const err = new Error("Invalid or expired token");
    err.status = 400;
    throw err;
  }

  if (payload.type !== "invite" && payload.type !== "reset") {
    const err = new Error("Invalid token");
    err.status = 400;
    throw err;
  }

  const userId = payload.id || payload.sub;
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return { user, purpose: payload.type };
}

module.exports = verifyInvite;
