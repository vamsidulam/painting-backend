const Order = require("../../models/Order");
const {
  generateDayBuckets,
  generateWeeksOfMonth,
  generateMonthsOfYear,
  generateYearBuckets,
} = require("./buckets");

async function getOrdersPerPeriod({ period = "day", year, month } = {}) {
  const now = new Date();
  let match = {};
  let format;
  let expectedKeys;
  let selectedYear;
  let selectedMonth;

  if (period === "day") {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - 29);
    match = { createdAt: { $gte: since } };
    format = "%Y-%m-%d";
    expectedKeys = generateDayBuckets(30);
  } else if (period === "week") {
    selectedYear = year ?? now.getFullYear();
    selectedMonth = month ?? now.getMonth() + 1;
    const mIdx = selectedMonth - 1;
    const start = new Date(selectedYear, mIdx, 1);
    const end = new Date(selectedYear, mIdx + 1, 1);
    match = { createdAt: { $gte: start, $lt: end } };
    format = "%G-W%V";
    expectedKeys = generateWeeksOfMonth(selectedYear, mIdx);
  } else if (period === "month") {
    selectedYear = year ?? now.getFullYear();
    const start = new Date(selectedYear, 0, 1);
    const end = new Date(selectedYear + 1, 0, 1);
    match = { createdAt: { $gte: start, $lt: end } };
    format = "%Y-%m";
    expectedKeys = generateMonthsOfYear(selectedYear);
  } else {
    const currentYear = now.getFullYear();
    const start = new Date(currentYear - 3, 0, 1);
    match = { createdAt: { $gte: start } };
    format = "%Y";
    expectedKeys = generateYearBuckets(4);
  }

  const agg = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format, date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
  ]);

  const byKey = Object.fromEntries(agg.map((r) => [r._id, r.count]));
  const buckets = expectedKeys.map((k) => ({ key: k, count: byKey[k] || 0 }));

  return {
    period,
    year: selectedYear,
    month: selectedMonth,
    buckets,
  };
}

module.exports = getOrdersPerPeriod;
