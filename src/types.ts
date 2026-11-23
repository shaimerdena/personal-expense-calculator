/** Supported spending categories. */
export type Category =
  | "food"
  | "transport"
  | "housing"
  | "entertainment"
  | "health"
  | "other";

/** A single recorded expense. `date` is an ISO calendar date (YYYY-MM-DD). */
export interface Expense {
  readonly id: string;
  readonly description: string;
  readonly amount: number;
  readonly category: Category;
  readonly date: string;
}

/** Input needed to create an expense (the id is generated). */
export type NewExpense = Omit<Expense, "id">;

/** A filter strategy: returns true when an expense should be kept. */
export type ExpenseFilter = (expense: Expense) => boolean;

/** Aggregate view of a list of expenses. */
export interface Summary {
  readonly count: number;
  readonly total: number;
  readonly byCategory: Partial<Record<Category, number>>;
}

/** Outcome of comparing spending against a budget limit. */
export interface BudgetResult {
  readonly limit: number;
  readonly spent: number;
  readonly remaining: number;
  readonly overBy: number;
  readonly withinBudget: boolean;
}
