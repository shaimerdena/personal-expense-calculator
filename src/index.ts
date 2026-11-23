import {
  addExpense,
  applyBudget,
  calculateTotal,
  filterByCategory,
  filterByDateRange,
  summarize,
} from "./calculator.js";
import type { Expense } from "./types.js";

// Sample (fictional) data.
let expenses: Expense[] = [];
expenses = addExpense(expenses, { description: "Groceries", amount: 54.2, category: "food", date: "2025-03-02" });
expenses = addExpense(expenses, { description: "Bus pass", amount: 30, category: "transport", date: "2025-03-05" });
expenses = addExpense(expenses, { description: "Movie night", amount: 18.75, category: "entertainment", date: "2025-03-14" });
expenses = addExpense(expenses, { description: "Lunch", amount: 12.4, category: "food", date: "2025-03-20" });

console.log("Total:", calculateTotal(expenses));
console.log("Food only:", calculateTotal(filterByCategory(expenses, "food")));
console.log("First half of March:", calculateTotal(filterByDateRange(expenses, "2025-03-01", "2025-03-15")));
console.log("Summary:", summarize(expenses));
console.log("Budget (100):", applyBudget(expenses, 100));
