import { test } from "node:test";
import assert from "node:assert/strict";
import { summarize, validateExpense } from "../src/lib/expenses.js";

const sample = [
  { amount: 120.5, category: "Food", date: "2026-11-02" },
  { amount: 30, category: "Transport", date: "2026-11-15" },
  { amount: 999, category: "Bills", date: "2026-10-31" },
];

test("summarize only counts the requested month", () => {
  const s = summarize(sample, "2026-11");
  assert.equal(s.count, 2);
  assert.equal(s.total, 150.5);
  assert.equal(s.byCategory.Food, 120.5);
  assert.equal(s.byCategory.Bills, 0);
});

test("summarize rounds to cents", () => {
  const s = summarize([{ amount: 0.1, category: "Other", date: "2026-11-01" }, { amount: 0.2, category: "Other", date: "2026-11-01" }], "2026-11");
  assert.equal(s.total, 0.3);
});

test("validateExpense flags bad input and accepts good input", () => {
  assert.deepEqual(validateExpense({ amount: "0", category: "Food", date: "2026-11-01" }), { amount: "Enter an amount greater than 0" });
  assert.equal(validateExpense({ amount: "12", category: "Food", date: "2026-11-01" }).category, undefined);
  assert.ok(validateExpense({ amount: "12", category: "Nope", date: "2026-11-01" }).category);
  assert.ok(validateExpense({ amount: "12", category: "Food", date: "" }).date);
});
