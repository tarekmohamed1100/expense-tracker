import { useEffect, useState } from "react";
import { CATEGORIES, summarize, validateExpense } from "./lib/expenses.js";

const KEY = "expense-tracker-v1";
const today = () => new Date().toISOString().slice(0, 10);
const currentMonth = () => today().slice(0, 7);

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

const money = (n) => n.toLocaleString(undefined, { style: "currency", currency: "USD" });

export default function App() {
  const [expenses, setExpenses] = useState(load);
  const [month, setMonth] = useState(currentMonth);
  const [form, setForm] = useState({ amount: "", category: "Food", date: today(), note: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(expenses));
  }, [expenses]);

  const summary = summarize(expenses, month);
  const monthItems = expenses.filter((e) => e.date.slice(0, 7) === month).sort((a, b) => b.date.localeCompare(a.date));

  const submit = (e) => {
    e.preventDefault();
    const found = validateExpense(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setExpenses((list) => [...list, { ...form, amount: Number(form.amount), id: crypto.randomUUID(), note: form.note.trim() }]);
    setForm((f) => ({ ...f, amount: "", note: "" }));
  };

  const remove = (id) => setExpenses((list) => list.filter((e) => e.id !== id));

  const field = "w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Expense tracker</h1>
          <label className="text-sm">
            <span className="mr-2 text-slate-500">Month</span>
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-md border border-slate-300 px-2 py-1" />
          </label>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm sm:col-span-1">
            <p className="text-sm text-slate-500">Total this month</p>
            <p className="mt-1 text-3xl font-bold">{money(summary.total)}</p>
            <p className="mt-1 text-sm text-slate-500">{summary.count} entries</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm sm:col-span-2">
            <p className="mb-3 text-sm text-slate-500">By category</p>
            <ul className="space-y-2">
              {CATEGORIES.map((c) => {
                const value = summary.byCategory[c] || 0;
                const pct = summary.total ? (value / summary.total) * 100 : 0;
                return (
                  <li key={c} className="text-sm">
                    <div className="flex justify-between">
                      <span>{c}</span>
                      <span className="tabular-nums text-slate-500">{money(value)}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-indigo-500 transition-[width] duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <form onSubmit={submit} noValidate className="grid gap-3 rounded-xl bg-white p-5 shadow-sm sm:grid-cols-5">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Amount</span>
            <input className={field} inputMode="decimal" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            {errors.amount && <span className="mt-1 block text-xs text-rose-600">{errors.amount}</span>}
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Category</span>
            <select className={field} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Date</span>
            <input type="date" className={field} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            {errors.date && <span className="mt-1 block text-xs text-rose-600">{errors.date}</span>}
          </label>
          <label className="block sm:col-span-1">
            <span className="mb-1 block text-sm text-slate-600">Note</span>
            <input className={field} maxLength={80} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </label>
          <div className="flex items-end">
            <button className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Add expense</button>
          </div>
        </form>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          {monthItems.length === 0 ? (
            <p className="text-sm text-slate-500">No expenses this month yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {monthItems.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{e.note || e.category}</p>
                    <p className="text-slate-500">{e.category} · {e.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="tabular-nums font-semibold">{money(e.amount)}</span>
                    <button onClick={() => remove(e.id)} className="text-rose-600 hover:underline">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
