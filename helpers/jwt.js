const jwt = require("jsonwebtoken");

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
}

function signAuthToken(payload) {
  return jwt.sign(payload, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function signResetToken(payload) {
  return jwt.sign({ ...payload, type: "reset" }, getSecret(), {
    expiresIn: process.env.JWT_RESET_EXPIRES_IN || "15m",
  });
}

function signInviteToken(payload) {
  return jwt.sign({ ...payload, type: "invite" }, getSecret(), {
    expiresIn: process.env.JWT_INVITE_EXPIRES_IN || "24h",
  });
}

function verifyToken(token) {
  return jwt.verify(token, getSecret());
}

module.exports = {
  signAuthToken,
  signResetToken,
  signInviteToken,
  verifyToken,
};
