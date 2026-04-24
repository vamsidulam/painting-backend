const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.APP_EMAIL || !process.env.APP_PASSWORD) {
    throw new Error("APP_EMAIL and APP_PASSWORD must be set to send email");
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
  return transporter;
}

function getFrontendUrl() {
  const url = process.env.FRONTEND_URL;
  if (!url) throw new Error("FRONTEND_URL is not set");
  return url.replace(/\/$/, "");
}

function buildSetPasswordLink(token) {
  return `${getFrontendUrl()}/admin/set-password?token=${encodeURIComponent(token)}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return c;
    }
  });
}

async function sendMail({ to, subject, html, text }) {
  const t = getTransporter();
  return t.sendMail({
    from: `"PaintBrush" <${process.env.APP_EMAIL}>`,
    to,
    subject,
    text,
    html,
  });
}

async function sendAdminInvite({ to, name, token }) {
  const link = buildSetPasswordLink(token);
  const safeName = escapeHtml(name);
  const subject = "You've been invited to PaintBrush Admin";

  const text = [
    `Hi ${name},`,
    "",
    "You've been added as an admin on PaintBrush.",
    "Click the link below to set your password and finish setting up your account:",
    link,
    "",
    "This link expires in 24 hours.",
    "",
    "— PaintBrush",
  ].join("\n");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0a1a2e">
      <h2 style="color:#005dc3;margin:0 0 16px">Welcome to PaintBrush Admin</h2>
      <p>Hi ${safeName},</p>
      <p>You've been added as an admin. Click the button below to set your password and finish setting up your account.</p>
      <p style="margin:24px 0">
        <a href="${link}" style="display:inline-block;background:#005dc3;color:#ffffff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">Set your password</a>
      </p>
      <p style="color:#4a6888;font-size:13px">Or paste this link into your browser:<br><span style="word-break:break-all">${link}</span></p>
      <p style="color:#4a6888;font-size:13px;margin-top:24px">This link expires in 24 hours.</p>
    </div>
  `;

  return sendMail({ to, subject, html, text });
}

async function sendPasswordReset({ to, name, token }) {
  const link = buildSetPasswordLink(token);
  const safeName = escapeHtml(name);
  const subject = "Reset your PaintBrush password";

  const text = [
    `Hi ${name},`,
    "",
    "We received a request to reset your password.",
    "Click the link below to pick a new one:",
    link,
    "",
    "If you didn't request this, you can safely ignore this email.",
    "This link expires in 15 minutes.",
    "",
    "— PaintBrush",
  ].join("\n");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0a1a2e">
      <h2 style="color:#005dc3;margin:0 0 16px">Reset your password</h2>
      <p>Hi ${safeName},</p>
      <p>We received a request to reset your password. Click the button below to pick a new one.</p>
      <p style="margin:24px 0">
        <a href="${link}" style="display:inline-block;background:#005dc3;color:#ffffff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">Reset password</a>
      </p>
      <p style="color:#4a6888;font-size:13px">Or paste this link into your browser:<br><span style="word-break:break-all">${link}</span></p>
      <p style="color:#4a6888;font-size:13px;margin-top:24px">If you didn't request this, you can safely ignore this email. This link expires in 15 minutes.</p>
    </div>
  `;

  return sendMail({ to, subject, html, text });
}

module.exports = {
  sendMail,
  sendAdminInvite,
  sendPasswordReset,
  buildSetPasswordLink,
  getFrontendUrl,
};
