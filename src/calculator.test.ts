import { describe, expect, it } from "vitest";
import {
  addExpense,
  applyBudget,
  byCategory,
  byDateRange,
  calculateTotal,
  filterByCategory,
  filterByDateRange,
  filterExpenses,
  summarize,
} from "./calculator.js";
import type { Expense } from "./types.js";

const seed = (): Expense[] => {
  let list: Expense[] = [];
  list = addExpense(list, { description: "Lunch", amount: 10.1, category: "food", date: "2025-01-10" });
  list = addExpense(list, { description: "Train", amount: 20.2, category: "transport", date: "2025-01-15" });
  list = addExpense(list, { description: "Dinner", amount: 30, category: "food", date: "2025-02-01" });
  return list;
};

describe("addExpense", () => {
  it("appends without mutating the original list", () => {
    const original: Expense[] = [];
    const updated = addExpense(original, { description: "Tea", amount: 3, category: "food", date: "2025-01-01" });
    expect(original).toHaveLength(0);
    expect(updated).toHaveLength(1);
    expect(updated[0]?.id).toBe("exp-1");
  });

  it("generates unique monotonic IDs when adding to a filtered list (RSK-02)", () => {
    const foodOnly = filterByCategory(seed(), "food"); // contains exp-1 and exp-3
    const updated = addExpense(foodOnly, { description: "Snack", amount: 5, category: "food", date: "2025-02-05" });
    expect(updated.map((e) => e.id)).toEqual(["exp-1", "exp-3", "exp-4"]);
  });

  it("rejects non-positive or non-finite amounts", () => {
    const bad = { description: "x", category: "other", date: "2025-01-01" } as const;
    expect(() => addExpense([], { ...bad, amount: 0 })).toThrow(RangeError);
    expect(() => addExpense([], { ...bad, amount: -5 })).toThrow(RangeError);
    expect(() => addExpense([], { ...bad, amount: Number.NaN })).toThrow(RangeError);
  });

  it("rejects malformed and impossible dates", () => {
    const base = { description: "x", amount: 1, category: "other" } as const;
    expect(() => addExpense([], { ...base, date: "01/02/2025" })).toThrow(RangeError);
    expect(() => addExpense([], { ...base, date: "2025-02-30" })).toThrow(RangeError);
  });
});

describe("filters", () => {
  it("filters by category", () => {
    expect(filterByCategory(seed(), "food")).toHaveLength(2);
    expect(filterByCategory(seed(), "health")).toEqual([]);
  });

  it("filters by inclusive date range with optional bounds", () => {
    expect(filterByDateRange(seed(), "2025-01-10", "2025-01-15")).toHaveLength(2);
    expect(filterByDateRange(seed(), "2025-01-16")).toHaveLength(1);
    expect(filterByDateRange(seed(), undefined, "2025-01-10")).toHaveLength(1);
    expect(filterByDateRange(seed())).toHaveLength(3);
  });

  it("rejects malformed or inverted date range bounds (RSK-01)", () => {
    const list = seed();
    expect(() => filterByDateRange(list, "2025-1-5")).toThrow(RangeError);
    expect(() => filterByDateRange(list, undefined, "2025-02-30")).toThrow(RangeError);
    expect(() => filterByDateRange(list, "2025-02-01", "2025-01-01")).toThrow(RangeError);
  });
});

describe("filterExpenses", () => {
  it("composes byCategory and byDateRange in a single pass", () => {
    const result = filterExpenses(seed(), byCategory("food"), byDateRange("2025-01-01", "2025-01-31"));
    expect(result.map((e) => e.description)).toEqual(["Lunch"]);
  });

  it("returns a new, equal list when no filters are given", () => {
    const list = seed();
    const result = filterExpenses(list);
    expect(result).toEqual(list);
    expect(result).not.toBe(list);
  });
});

describe("totals and summary", () => {
  it("totals without floating-point drift", () => {
    expect(calculateTotal(seed())).toBe(60.3);
  });

  it("returns 0 for an empty list", () => {
    expect(calculateTotal([])).toBe(0);
    expect(summarize([])).toEqual({ count: 0, total: 0, byCategory: {} });
  });

  it("summarizes totals per category", () => {
    expect(summarize(seed())).toEqual({
      count: 3,
      total: 60.3,
      byCategory: { food: 40.1, transport: 20.2 },
    });
  });
});

describe("applyBudget", () => {
  it("reports remaining budget when under the limit", () => {
    expect(applyBudget(seed(), 100)).toEqual({
      limit: 100, spent: 60.3, remaining: 39.7, overBy: 0, withinBudget: true,
    });
  });

  it("reports the overspend when over the limit", () => {
    const result = applyBudget(seed(), 50);
    expect(result.withinBudget).toBe(false);
    expect(result.overBy).toBe(10.3);
    expect(result.remaining).toBe(0);
  });

  it("treats spending exactly at the limit as within budget", () => {
    expect(applyBudget(seed(), 60.3).withinBudget).toBe(true);
  });

  it("rejects negative limits", () => {
    expect(() => applyBudget([], -1)).toThrow(RangeError);
  });
});
