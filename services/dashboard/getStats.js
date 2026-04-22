const User = require("../../models/User");
const Order = require("../../models/Order");

async function getStats() {
  const [
    totalCustomers,
    bookingAgg,
    revenueAgg,
    workAgg,
  ] = await Promise.all([
    User.countDocuments({ role: "customer" }),
    Order.aggregate([
      { $match: { status: { $in: ["accepted", "rejected"] } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { status: "accepted" } },
      { $group: { _id: null, total: { $sum: "$totalCost" } } },
    ]),
    Order.aggregate([
      { $match: { workStatus: { $in: ["started", "completed"] } } },
      { $group: { _id: "$workStatus", count: { $sum: 1 } } },
    ]),
  ]);

  const bookingCounts = Object.fromEntries(
    bookingAgg.map((b) => [b._id, b.count]),
  );
  const workCounts = Object.fromEntries(
    workAgg.map((w) => [w._id, w.count]),
  );

  return {
    totalCustomers,
    totalBookings:
      (bookingCounts.accepted || 0) + (bookingCounts.rejected || 0),
    totalRevenue: revenueAgg[0]?.total || 0,
    completedJobs: workCounts.completed || 0,
    pendingJobs: workCounts.started || 0,
  };
}

module.exports = getStats;
