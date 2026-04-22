const User = require("../../models/User");
const { hashPassword } = require("../../helpers/password");
const { verifyToken } = require("../../helpers/jwt");

async function resetPassword({ token, password }) {
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    const err = new Error("Invalid or expired token");
    err.status = 400;
    throw err;
  }

  if (payload.type !== "reset" && payload.type !== "invite") {
    const err = new Error("Invalid token");
    err.status = 400;
    throw err;
  }

  const userId = payload.id || payload.sub;
  const hashed = await hashPassword(password);

  const user = await User.findByIdAndUpdate(
    userId,
    { password: hashed, updatedBy: userId },
    { new: true },
  );

  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return { message: "Password has been set successfully." };
}

module.exports = resetPassword;
