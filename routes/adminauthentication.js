const express = require("express");

const {
  login,
  signup,
  forgotPassword,
  resetPassword,
  verifyInvite,
  me,
} = require("../services/adminauthentication");

const loginRequest = require("../models/requests/loginRequest");
const signupRequest = require("../models/requests/signupRequest");
const forgotPasswordRequest = require("../models/requests/forgotPasswordRequest");
const resetPasswordRequest = require("../models/requests/resetPasswordRequest");
const verifyInviteRequest = require("../models/requests/verifyInviteRequest");

const { validateBody } = require("../helpers/validation");
const {
  authResponse,
  messageResponse,
  serializeUser,
} = require("../models/responses/authResponse");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.post("/login", validateBody(loginRequest), async (req, res, next) => {
  try {
    const result = await login(req.validated);
    res.status(200).json(authResponse(result));
  } catch (err) {
    next(err);
  }
});

router.post(
  "/signup",
  requireAdmin,
  validateBody(signupRequest),
  async (req, res, next) => {
    try {
      const { user } = await signup(req.validated, req.user);
      res.status(201).json({
        success: true,
        message: `Invitation email sent to ${user.email}`,
        data: { user: serializeUser(user) },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/forgotpassword",
  validateBody(forgotPasswordRequest),
  async (req, res, next) => {
    try {
      const { message } = await forgotPassword(req.validated);
      res.status(200).json(messageResponse(message));
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/resetpassword",
  validateBody(resetPasswordRequest),
  async (req, res, next) => {
    try {
      const { message } = await resetPassword(req.validated);
      res.status(200).json(messageResponse(message));
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/verify-invite",
  validateBody(verifyInviteRequest),
  async (req, res, next) => {
    try {
      const { user, purpose } = await verifyInvite(req.validated);
      res.status(200).json({
        success: true,
        data: { user: serializeUser(user), purpose },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.get("/me", requireAdmin, async (req, res, next) => {
  try {
    const { user } = await me(req.user.id);
    res.status(200).json({
      success: true,
      data: { user: serializeUser(user) },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
