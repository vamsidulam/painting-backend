const { hashPassword, comparePassword } = require("./password");
const {
  signAuthToken,
  signResetToken,
  signInviteToken,
  verifyToken,
} = require("./jwt");
const { validateBody, validateQuery } = require("./validation");
const {
  sendMail,
  sendAdminInvite,
  sendPasswordReset,
  sendCustomerBookingConfirmation,
  sendAdminBookingNotification,
  buildSetPasswordLink,
  getFrontendUrl,
} = require("./email");
const { uploadImage, slugify, ensureUploadsDir } = require("./upload");

module.exports = {
  hashPassword,
  comparePassword,
  signAuthToken,
  signResetToken,
  signInviteToken,
  verifyToken,
  validateBody,
  validateQuery,
  sendMail,
  sendAdminInvite,
  sendPasswordReset,
  sendCustomerBookingConfirmation,
  sendAdminBookingNotification,
  buildSetPasswordLink,
  getFrontendUrl,
  uploadImage,
  slugify,
  ensureUploadsDir,
};
