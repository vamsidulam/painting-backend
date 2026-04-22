function runValidation(schema, payload, req, res) {
  const result = schema.safeParse(payload);
  if (!result.success) {
    res.status(400).json({
      success: false,
      error: "ValidationError",
      issues: result.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
    return false;
  }
  req.validated = result.data;
  return true;
}

function validateBody(schema) {
  return (req, res, next) => {
    if (runValidation(schema, req.body, req, res)) next();
  };
}

function validateQuery(schema) {
  return (req, res, next) => {
    if (runValidation(schema, req.query, req, res)) next();
  };
}

module.exports = { validateBody, validateQuery };
