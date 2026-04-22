const User = require("../../models/User");
const { signResetToken } = require("../../helpers/jwt");
const { sendPasswordReset } = require("../../helpers/email");

async function forgotPassword({ email }) {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  const message = "If that email exists, a reset link has been sent.";

  if (!user) {
    return { message };
  }

  const resetToken = signResetToken({
    sub: String(user._id),
    id: String(user._id),
    email: user.email,
  });

  try {
    await sendPasswordReset({
      to: user.email,
      name: user.name,
      token: resetToken,
    });
  } catch (err) {
    console.error("Failed to send reset email:", err);
  }

  return { message };
}

module.exports = forgotPassword;
