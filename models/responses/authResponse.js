function serializeUser(user) {
  const plain = typeof user.toJSON === "function" ? user.toJSON() : user;
  return {
    id: plain.id || (plain._id ? String(plain._id) : undefined),
    name: plain.name,
    email: plain.email,
    phone: plain.phone,
    role: plain.role,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
    createdBy: plain.createdBy ? String(plain.createdBy) : null,
    updatedBy: plain.updatedBy ? String(plain.updatedBy) : null,
  };
}

function authResponse({ user, token }) {
  return {
    success: true,
    data: {
      token,
      user: serializeUser(user),
    },
  };
}

function messageResponse(message, extras = {}) {
  return { success: true, message, ...extras };
}

module.exports = { authResponse, messageResponse, serializeUser };
