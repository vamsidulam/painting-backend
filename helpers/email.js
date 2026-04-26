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

function formatRupees(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "—";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatAddress(address) {
  if (!address) return "—";
  return [
    address.doorNumber,
    address.street,
    address.city,
    address.district,
    address.state,
    address.pincode,
  ]
    .filter((p) => p && String(p).trim())
    .join(", ");
}

function capitalize(s) {
  const v = String(s || "");
  return v ? v[0].toUpperCase() + v.slice(1) : "";
}

function bookingDetailRows(items) {
  return items
    .filter((it) => it && it.value !== undefined && it.value !== null)
    .map(
      (it) => `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #eef2f7;color:#4a6888;font-size:13px;width:42%">${escapeHtml(it.label)}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #eef2f7;color:#0a1a2e;font-size:14px;font-weight:500">${escapeHtml(it.value)}</td>
        </tr>`,
    )
    .join("");
}

function brandHeader(title) {
  return `
    <div style="background:linear-gradient(135deg,#005dc3 0%,#0a1a2e 100%);padding:32px 24px;text-align:center;border-radius:16px 16px 0 0">
      <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 18px">
        <span style="color:#ffffff;font-family:Inter,Arial,sans-serif;font-weight:700;font-size:18px;letter-spacing:0.5px">PaintBrush</span>
      </div>
      <h1 style="color:#ffffff;font-family:Inter,Arial,sans-serif;font-size:24px;font-weight:700;margin:18px 0 0">${escapeHtml(title)}</h1>
    </div>
  `;
}

function brandFooter() {
  return `
    <div style="padding:20px 24px;text-align:center;background:#f5f8fc;border-radius:0 0 16px 16px;color:#7d92ad;font-size:12px;font-family:Inter,Arial,sans-serif">
      © ${new Date().getFullYear()} PaintBrush · Premium painting services on demand.
    </div>
  `;
}

async function sendCustomerBookingConfirmation({
  to,
  customer,
  category,
  service,
  workType,
  propertyType,
  sqft,
  totalCost,
  address,
  includesMoney,
  orderId,
}) {
  const showMoney = includesMoney !== false;
  const safeCustomerName = escapeHtml(customer?.name || "there");
  const subject = "Your PaintBrush booking is confirmed";

  const detailItems = [
    { label: "Booking ID", value: orderId ? String(orderId) : "" },
    { label: "Category", value: category || "" },
    {
      label: "Service",
      value: service?.name || "",
    },
    {
      label: "Work type",
      value:
        workType === "repainting"
          ? "Repainting"
          : workType === "fresh"
            ? "Fresh Painting"
            : "",
    },
    { label: "Property type", value: capitalize(propertyType) },
    { label: "Area", value: sqft ? `${Number(sqft).toLocaleString()} sqft` : "" },
    {
      label: "Cost / sqft",
      value: showMoney && service?.cost ? formatRupees(service.cost) : "",
    },
    { label: "Service location", value: formatAddress(address) },
  ];

  const totalBlock = showMoney
    ? `
        <div style="margin:24px 0;padding:20px 24px;background:linear-gradient(135deg,#eaf3ff 0%,#f5f8fc 100%);border:1px solid #cfe0f5;border-radius:14px;text-align:center">
          <div style="color:#4a6888;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase">Estimated total</div>
          <div style="color:#005dc3;font-family:Inter,Arial,sans-serif;font-size:32px;font-weight:800;margin-top:6px">${formatRupees(totalCost)}</div>
          ${
            sqft && service?.cost
              ? `<div style="color:#7d92ad;font-size:12px;margin-top:4px">${Number(sqft).toLocaleString()} sqft × ${formatRupees(service.cost)} / sqft</div>`
              : ""
          }
        </div>`
    : "";

  const html = `
    <div style="background:#f5f8fc;padding:24px;font-family:Inter,Arial,sans-serif">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(10,26,46,0.08)">
        ${brandHeader("Booking confirmed")}
        <div style="padding:28px 24px">
          <p style="color:#0a1a2e;font-size:16px;margin:0 0 8px">Hi ${safeCustomerName},</p>
          <p style="color:#4a6888;font-size:14px;line-height:1.6;margin:0 0 20px">
            Thanks for booking with <strong style="color:#0a1a2e">PaintBrush</strong>. We've received your request and our team will reach out shortly on your registered phone to confirm the slot and next steps.
          </p>
          ${totalBlock}
          <h3 style="color:#0a1a2e;font-size:15px;font-weight:700;margin:24px 0 12px">Booking details</h3>
          <table style="width:100%;border-collapse:collapse;background:#fafcff;border:1px solid #eef2f7;border-radius:12px;overflow:hidden">
            <tbody>${bookingDetailRows(detailItems)}</tbody>
          </table>
          <div style="margin-top:24px;padding:16px;background:#fff8e6;border-left:3px solid #f5b400;border-radius:8px">
            <p style="color:#5a4a00;font-size:13px;margin:0;line-height:1.5">
              <strong>What's next?</strong> Our agent will call you on <strong>${escapeHtml(customer?.phone || "your phone")}</strong> within a few hours to confirm timing and answer any questions.
            </p>
          </div>
          <p style="color:#7d92ad;font-size:12px;line-height:1.6;margin:24px 0 0">
            Need to make changes? Just reply to this email and we'll help you out.
          </p>
        </div>
        ${brandFooter()}
      </div>
    </div>
  `;

  const text = [
    `Hi ${customer?.name || "there"},`,
    "",
    "Your PaintBrush booking is confirmed.",
    "",
    "Booking details:",
    orderId ? `Booking ID: ${orderId}` : null,
    category ? `Category: ${category}` : null,
    service?.name ? `Service: ${service.name}` : null,
    workType
      ? `Work type: ${workType === "repainting" ? "Repainting" : "Fresh Painting"}`
      : null,
    propertyType ? `Property type: ${capitalize(propertyType)}` : null,
    sqft ? `Area: ${Number(sqft).toLocaleString()} sqft` : null,
    showMoney && service?.cost ? `Cost / sqft: ${formatRupees(service.cost)}` : null,
    showMoney ? `Estimated total: ${formatRupees(totalCost)}` : null,
    `Location: ${formatAddress(address)}`,
    "",
    "Our team will call you shortly to confirm the slot.",
    "",
    "— PaintBrush",
  ]
    .filter(Boolean)
    .join("\n");

  return sendMail({ to, subject, html, text });
}

async function sendAdminBookingNotification({
  to,
  customer,
  category,
  service,
  workType,
  propertyType,
  sqft,
  totalCost,
  address,
  includesMoney,
  orderId,
}) {
  const showMoney = includesMoney !== false;
  const subject = `New booking: ${customer?.name || "Customer"} — ${service?.name || "Service"}`;

  const customerItems = [
    { label: "Name", value: customer?.name || "" },
    { label: "Email", value: customer?.email || "" },
    { label: "Phone", value: customer?.phone || "" },
  ];

  const bookingItems = [
    { label: "Booking ID", value: orderId ? String(orderId) : "" },
    { label: "Category", value: category || "" },
    { label: "Service", value: service?.name || "" },
    {
      label: "Work type",
      value:
        workType === "repainting"
          ? "Repainting"
          : workType === "fresh"
            ? "Fresh Painting"
            : "",
    },
    { label: "Property type", value: capitalize(propertyType) },
    { label: "Area", value: sqft ? `${Number(sqft).toLocaleString()} sqft` : "" },
    {
      label: "Cost / sqft",
      value: showMoney && service?.cost ? formatRupees(service.cost) : "",
    },
    {
      label: "Total cost",
      value: showMoney ? formatRupees(totalCost) : "",
    },
    { label: "Service location", value: formatAddress(address) },
  ];

  const html = `
    <div style="background:#f5f8fc;padding:24px;font-family:Inter,Arial,sans-serif">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(10,26,46,0.08)">
        ${brandHeader("New booking received")}
        <div style="padding:28px 24px">
          <p style="color:#4a6888;font-size:14px;line-height:1.6;margin:0 0 24px">
            A new booking has just been submitted on PaintBrush. Reach out to the customer to confirm the slot.
          </p>

          <h3 style="color:#0a1a2e;font-size:15px;font-weight:700;margin:0 0 12px;display:flex;align-items:center;gap:8px">
            <span style="display:inline-block;width:4px;height:16px;background:#005dc3;border-radius:2px"></span>
            Customer
          </h3>
          <table style="width:100%;border-collapse:collapse;background:#fafcff;border:1px solid #eef2f7;border-radius:12px;overflow:hidden;margin-bottom:24px">
            <tbody>${bookingDetailRows(customerItems)}</tbody>
          </table>

          <h3 style="color:#0a1a2e;font-size:15px;font-weight:700;margin:0 0 12px;display:flex;align-items:center;gap:8px">
            <span style="display:inline-block;width:4px;height:16px;background:#005dc3;border-radius:2px"></span>
            Booking
          </h3>
          <table style="width:100%;border-collapse:collapse;background:#fafcff;border:1px solid #eef2f7;border-radius:12px;overflow:hidden">
            <tbody>${bookingDetailRows(bookingItems)}</tbody>
          </table>

          <div style="margin-top:24px;padding:14px 16px;background:#eaf3ff;border-radius:10px;text-align:center">
            <a href="tel:${escapeHtml(customer?.phone || "")}" style="color:#005dc3;font-weight:600;font-size:14px;text-decoration:none">
              📞 Call customer: ${escapeHtml(customer?.phone || "—")}
            </a>
          </div>
        </div>
        ${brandFooter()}
      </div>
    </div>
  `;

  const text = [
    "New booking received on PaintBrush.",
    "",
    "Customer:",
    customer?.name ? `Name: ${customer.name}` : null,
    customer?.email ? `Email: ${customer.email}` : null,
    customer?.phone ? `Phone: ${customer.phone}` : null,
    "",
    "Booking:",
    orderId ? `Booking ID: ${orderId}` : null,
    category ? `Category: ${category}` : null,
    service?.name ? `Service: ${service.name}` : null,
    workType
      ? `Work type: ${workType === "repainting" ? "Repainting" : "Fresh Painting"}`
      : null,
    propertyType ? `Property type: ${capitalize(propertyType)}` : null,
    sqft ? `Area: ${Number(sqft).toLocaleString()} sqft` : null,
    showMoney && service?.cost ? `Cost / sqft: ${formatRupees(service.cost)}` : null,
    showMoney ? `Total cost: ${formatRupees(totalCost)}` : null,
    `Location: ${formatAddress(address)}`,
    "",
    "— PaintBrush",
  ]
    .filter(Boolean)
    .join("\n");

  return sendMail({ to, subject, html, text });
}

module.exports = {
  sendMail,
  sendAdminInvite,
  sendPasswordReset,
  sendCustomerBookingConfirmation,
  sendAdminBookingNotification,
  buildSetPasswordLink,
  getFrontendUrl,
};
