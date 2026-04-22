const Order = require("../../models/Order");

async function getOrderStatusCounts() {
  const agg = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const counts = { requested: 0, accepted: 0, rejected: 0 };
  for (const row of agg) {
    if (row._id in counts) counts[row._id] = row.count;
  }

  const total = counts.requested + counts.accepted + counts.rejected;
  return { counts, total };
}

module.exports = getOrderStatusCounts;
