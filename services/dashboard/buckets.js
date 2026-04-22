function pad(n) {
  return String(n).padStart(2, "0");
}

function dayKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function monthKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

function isoWeekNumber(d) {
  const t = new Date(d);
  t.setHours(0, 0, 0, 0);
  t.setDate(t.getDate() + 3 - ((t.getDay() + 6) % 7));
  const firstThursday = new Date(t.getFullYear(), 0, 4);
  const diff = (t.getTime() - firstThursday.getTime()) / 86400000;
  return 1 + Math.round(diff / 7);
}

function isoWeekYear(d) {
  const t = new Date(d);
  t.setHours(0, 0, 0, 0);
  t.setDate(t.getDate() + 3 - ((t.getDay() + 6) % 7));
  return t.getFullYear();
}

function weekKey(d) {
  return `${isoWeekYear(d)}-W${pad(isoWeekNumber(d))}`;
}

function generateDayBuckets(count = 30) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const keys = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    keys.push(dayKey(d));
  }
  return keys;
}

function generateMonthBuckets(count = 12) {
  const today = new Date();
  const keys = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    keys.push(monthKey(d));
  }
  return keys;
}

function generateWeekBuckets(count = 12) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  const keys = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(monday);
    d.setDate(d.getDate() - i * 7);
    keys.push(weekKey(d));
  }
  return keys;
}

function generateWeeksOfMonth(year, monthIndex) {
  const keys = [];
  const seen = new Set();
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const k = weekKey(d);
    if (!seen.has(k)) {
      seen.add(k);
      keys.push(k);
    }
  }
  return keys;
}

function generateMonthsOfYear(year) {
  return Array.from(
    { length: 12 },
    (_, i) => `${year}-${pad(i + 1)}`,
  );
}

function generateYearBuckets(count = 4) {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) =>
    String(currentYear - (count - 1 - i)),
  );
}

function getPeriodStart(period) {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  if (period === "day") {
    since.setDate(since.getDate() - 29);
  } else if (period === "week") {
    since.setDate(since.getDate() - ((since.getDay() + 6) % 7));
    since.setDate(since.getDate() - 11 * 7);
  } else {
    since.setMonth(since.getMonth() - 11);
    since.setDate(1);
  }
  return since;
}

module.exports = {
  dayKey,
  monthKey,
  weekKey,
  generateDayBuckets,
  generateWeekBuckets,
  generateMonthBuckets,
  generateWeeksOfMonth,
  generateMonthsOfYear,
  generateYearBuckets,
  getPeriodStart,
};
