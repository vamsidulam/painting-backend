const Order = require("../../models/Order");
const { generateDayBuckets } = require("./buckets");

async function getRevenueOverTime({ days = 30 } = {}) {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const agg = await Order.aggregate([
    { $match: { status: "accepted", createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalCost" },
      },
    },
  ]);

  const byDate = Object.fromEntries(agg.map((r) => [r._id, r.revenue]));
  const dayKeys = generateDayBuckets(days);
  const series = dayKeys.map((d) => ({ date: d, revenue: byDate[d] || 0 }));

  return { days: series };
}

module.exports = getRevenueOverTime;
