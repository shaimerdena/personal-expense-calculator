import type {
  BudgetResult,
  Category,
  Expense,
  NewExpense,
  Summary,
} from "./types.js";

/** Round to 2 decimals to avoid floating-point drift (e.g. 0.1 + 0.2). */
const round2 = (n: number): number => Math.round(n * 100) / 100;

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

/** Return a new list with the expense appended. Throws on invalid input. */
export function addExpense(
  expenses: readonly Expense[],
  input: NewExpense,
): Expense[] {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new RangeError("Amount must be a positive, finite number");
  }
  if (!isValidDate(input.date)) {
    throw new RangeError(`Invalid date (expected YYYY-MM-DD): ${input.date}`);
  }
  const expense: Expense = {
    ...input,
    amount: round2(input.amount),
    id: `exp-${expenses.length + 1}`,
  };
  return [...expenses, expense];
}

export function filterByCategory(
  expenses: readonly Expense[],
  category: Category,
): Expense[] {
  return expenses.filter((e) => e.category === category);
}

/** Inclusive date range filter. Either bound may be omitted. */
export function filterByDateRange(
  expenses: readonly Expense[],
  from?: string,
  to?: string,
): Expense[] {
  // ISO dates sort correctly as plain strings.
  return expenses.filter(
    (e) => (from === undefined || e.date >= from) && (to === undefined || e.date <= to),
  );
}

export function calculateTotal(expenses: readonly Expense[]): number {
  return round2(expenses.reduce((sum, e) => sum + e.amount, 0));
}

export function summarize(expenses: readonly Expense[]): Summary {
  const byCategory: Partial<Record<Category, number>> = {};
  for (const e of expenses) {
    byCategory[e.category] = round2((byCategory[e.category] ?? 0) + e.amount);
  }
  return { count: expenses.length, total: calculateTotal(expenses), byCategory };
}

/** Compare total spending against a non-negative budget limit. */
export function applyBudget(
  expenses: readonly Expense[],
  limit: number,
): BudgetResult {
  if (!Number.isFinite(limit) || limit < 0) {
    throw new RangeError("Budget limit must be a non-negative, finite number");
  }
  const spent = calculateTotal(expenses);
  return {
    limit,
    spent,
    remaining: round2(Math.max(limit - spent, 0)),
    overBy: round2(Math.max(spent - limit, 0)),
    withinBudget: spent <= limit,
  };
}
