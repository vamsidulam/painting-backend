const User = require("../../models/User");
const { comparePassword } = require("../../helpers/password");
const { signAuthToken } = require("../../helpers/jwt");

async function login({ email, password }) {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const ok = await comparePassword(password, user.password);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  if (user.role !== "admin") {
    const err = new Error("Admin access required");
    err.status = 403;
    throw err;
  }

  const token = signAuthToken({
    sub: String(user._id),
    id: String(user._id),
    email: user.email,
    role: user.role,
  });

  return { user, token };
}

module.exports = login;
