const { verifyToken } = require("../helpers/jwt");

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ success: false, error: "Missing or invalid Authorization header" });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return res
      .status(401)
      .json({ success: false, error: "Invalid or expired token" });
  }

  if (payload.type === "reset") {
    return res
      .status(401)
      .json({ success: false, error: "Reset tokens cannot be used for authentication" });
  }

  if (payload.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, error: "Admin access required" });
  }

  req.user = {
    id: payload.id || payload.sub,
    email: payload.email,
    role: payload.role,
  };
  next();
}

module.exports = requireAdmin;
