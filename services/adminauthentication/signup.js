const crypto = require("crypto");

const User = require("../../models/User");
const { hashPassword } = require("../../helpers/password");
const { signInviteToken } = require("../../helpers/jwt");
const { sendAdminInvite } = require("../../helpers/email");

async function signup(input, actor) {
  const normalizedEmail = input.email.toLowerCase();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    const err = new Error("Email is already registered");
    err.status = 409;
    throw err;
  }

  // Random unguessable placeholder — the invitee replaces it via the emailed link.
  const placeholder = crypto.randomBytes(48).toString("hex");
  const hashed = await hashPassword(placeholder);

  const actorId = actor && actor.id ? actor.id : null;

  const user = await User.create({
    name: input.name,
    email: normalizedEmail,
    phone: input.phone,
    role: input.role,
    password: hashed,
    createdBy: actorId,
    updatedBy: actorId,
  });

  const inviteToken = signInviteToken({
    sub: String(user._id),
    id: String(user._id),
    email: user.email,
  });

  try {
    await sendAdminInvite({
      to: user.email,
      name: user.name,
      token: inviteToken,
    });
  } catch (err) {
    console.error("Failed to send invite email:", err);
  }

  return { user };
}

module.exports = signup;
