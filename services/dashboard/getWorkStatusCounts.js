const Order = require("../../models/Order");

async function getWorkStatusCounts() {
  const agg = await Order.aggregate([
    { $match: { workStatus: { $ne: null } } },
    { $group: { _id: "$workStatus", count: { $sum: 1 } } },
  ]);

  const counts = { pending: 0, started: 0, completed: 0 };
  for (const row of agg) {
    if (row._id in counts) counts[row._id] = row.count;
  }

  const total = counts.pending + counts.started + counts.completed;
  return { counts, total };
}

module.exports = getWorkStatusCounts;
