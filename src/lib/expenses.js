export const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Other"];

const round = (n) => Math.round(n * 100) / 100;

export const monthOf = (dateStr) => dateStr.slice(0, 7);

// Totals for one month ("YYYY-MM"), with a breakdown per category.
export function summarize(expenses, month) {
  const items = expenses.filter((e) => monthOf(e.date) === month);
  const byCategory = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
  for (const e of items) byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;

  return {
    count: items.length,
    total: round(items.reduce((sum, e) => sum + e.amount, 0)),
    byCategory: Object.fromEntries(Object.entries(byCategory).map(([k, v]) => [k, round(v)])),
  };
}

// Returns an object of field errors. Empty object means the input is valid.
export function validateExpense({ amount, category, date }) {
  const errors = {};
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) errors.amount = "Enter an amount greater than 0";
  if (!CATEGORIES.includes(category)) errors.category = "Pick a category";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) errors.date = "Pick a date";
  return errors;
}
