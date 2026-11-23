# AGENTS.md — Personal Expense Calculator

## 1. Project Purpose
A lightweight, self-contained TypeScript library and CLI demo for tracking personal expenses, filtering records, summarizing spending by category, and evaluating budget limits[cite: 43]. The project uses pure functions with zero external runtime dependencies[cite: 43].

## 2. Repository Architecture
- `src/types.ts` — Core TypeScript interfaces and union types (`Category`, `Expense`, `NewExpense`, `Summary`, `BudgetResult`)[cite: 43].
- `src/calculator.ts` — Pure business logic (`addExpense`, `filterByCategory`, `filterByDateRange`, `calculateTotal`, `summarize`, `applyBudget`)[cite: 43].
- `src/index.ts` — Runnable CLI entry script demonstrating sample fictional calculations[cite: 43].
- `src/calculator.test.ts` — Automated Vitest unit test suite covering core behaviors and edge cases[cite: 43].
- `tsconfig.json` & `tsconfig.build.json` — Strict ES2022/NodeNext TypeScript configs (`dist/` excludes test files)[cite: 43].

## 3. Setup & Safe Commands
Run all commands from the repository root:
- `npm install` — Install devDependencies (`typescript`, `vitest`, `@types/node`)[cite: 43].
- `npm test` — Execute the Vitest unit test suite (`vitest run`)[cite: 43].
- `npm run typecheck` — Run strict TypeScript type-checking (`tsc --noEmit`)[cite: 43].
- `npm run build` — Compile production JavaScript output to `dist/` (`tsc -p tsconfig.build.json`)[cite: 43].
- `npm start` — Build and execute the CLI demo (`node dist/index.js`)[cite: 43].

## 4. Coding Conventions & Acceptance Criteria
- **ESM Imports:** Always use explicit `.js` extensions on relative imports in `src/` (e.g., `./calculator.js`) for NodeNext compatibility[cite: 43].
- **Strict TypeScript:** Maintain `"strict": true` and `"noUncheckedIndexedAccess": true` without using `any` or `@ts-ignore`[cite: 43].
- **Core Acceptance Criteria (AC1–AC5):**
  - **AC1 (Immutability):** All functions in `src/calculator.ts` must remain pure and never mutate input arrays[cite: 43].
  - **AC2 (Input Validation):** Invalid amounts, malformed/impossible `YYYY-MM-DD` dates, and negative budget limits must throw `RangeError`[cite: 43].
  - **AC3 (Rounding):** Monetary calculations must round to 2 decimal places (`round2`) to prevent floating-point drift[cite: 43].
  - **AC4 (Accurate Filtering):** `filterByCategory` and `filterByDateRange` must return accurate subsets without side effects[cite: 43].
  - **AC5 (Budget Integrity):** `applyBudget` must accurately calculate `spent`, `remaining`, `overBy`, and `withinBudget`[cite: 43].

## 5. Test Expectations & Review Gates
- Before proposing acceptance or finishing any task, run `npm test`, `npm run typecheck`, and `npm run build`, and report exact pass/fail outputs[cite: 43].
- Add targeted regression tests in `src/calculator.test.ts` whenever fixing a bug or edge case[cite: 43].
- Require explicit human review and approval before applying any file edits, architectural changes, or patches.

## 6. Forbidden Actions
- **No Secrets:** Never hardcode API keys, tokens, credentials, `.env` files, or real personal/financial data[cite: 8, 13].
- **No Unreviewed Dependencies:** Do not add runtime dependencies or modify `package.json` without explicit user approval.
- **No External Deployments:** Do not configure CI/CD deployment pipelines, cloud hosting, or external network calls[cite: 13].
- **No Destructive Commands:** Do not run `rm -rf`, force git resets, or delete baseline test coverage[cite: 13].
- **No Unrelated Refactoring:** Keep diffs minimal and strictly scoped to the approved task.