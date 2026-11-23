# Expense Calculator

A small TypeScript library of pure functions for tracking personal expenses, with a demo entry script. No runtime dependencies; Vitest and TypeScript are dev-only.

## Usage

```bash
npm install
npm test            # run unit tests (Vitest)
npm run typecheck   # type-check src and tests
npm run build       # compile to dist/
npm start           # build, then run the demo (node dist/index.js)
```

## API (`src/calculator.ts`)

| Function | Purpose |
| --- | --- |
| `addExpense(list, input)` | Returns a new list with the expense added; validates amount and `YYYY-MM-DD` date |
| `filterByCategory(list, category)` | Expenses in one category |
| `filterByDateRange(list, from?, to?)` | Inclusive date range; either bound optional |
| `calculateTotal(list)` | Sum, rounded to 2 decimals |
| `summarize(list)` | Count, total, and per-category totals |
| `applyBudget(list, limit)` | Spent, remaining, overspend, and `withinBudget` |

All functions are pure and never mutate their inputs. Sample data in `src/index.ts` is fictional.
