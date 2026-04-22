const User = require("./User");

const loginRequest = require("./requests/loginRequest");
const signupRequest = require("./requests/signupRequest");
const forgotPasswordRequest = require("./requests/forgotPasswordRequest");
const resetPasswordRequest = require("./requests/resetPasswordRequest");

const {
  authResponse,
  messageResponse,
  serializeUser,
} = require("./responses/authResponse");

module.exports = {
  User,
  requests: {
    loginRequest,
    signupRequest,
    forgotPasswordRequest,
    resetPasswordRequest,
  },
  responses: {
    authResponse,
    messageResponse,
    serializeUser,
  },
};
