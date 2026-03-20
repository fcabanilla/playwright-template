---
description: 'Step-by-step guide for the correct Allure report workflow: clean results, run tests, preserve history, generate report'
---

# Allure Report Workflow

Follow this exact workflow for generating accurate Allure reports. Order matters!

## Step 1: Clean Previous Results (MANDATORY)

```bash
npm run report:clean:results
```

This runs `rm -rf .allure/results/*`. Allure accumulates results by design — skipping this step merges old + new results.

## Step 2: Run Tests

```bash
# Single test
TEST_ENV=${input:environment} npx playwright test tests/cinesa/${input:testPath} --project='Cinesa'

# Full suite
TEST_ENV=${input:environment} npm run test:cinesa
```

## Step 3: Generate Report with History

```bash
npm run report
```

This runs three commands in sequence:

1. `report:copy-history` — Copies `.allure/report/history/` → `.allure/results/history/` (preserves TREND graph data)
2. `report:generate` — Generates HTML report from `.allure/results/` → `.allure/report/`
3. `report:open` — Opens report in browser

## Important Notes

- **NEVER** run `report:clean` before `report:copy-history` — it deletes the history needed for trends
- **NEVER** delete `.allure/report/history/` manually — it contains trend data from last 20 executions
- The TREND graph shows test count per execution, not cumulative totals
- If a focused run shows "1 test" in trends, that's correct behavior

## Directory Reference

| Directory                       | Purpose                     | Clean?               |
| ------------------------------- | --------------------------- | -------------------- |
| `.allure/results/`              | Current execution JSON      | Yes, before each run |
| `.allure/report/`               | Generated HTML report       | Auto-regenerated     |
| `.allure/report/history/`       | Trend data (last 20 runs)   | NEVER delete         |
| `.allure/playwright-artifacts/` | Videos, screenshots, traces | Optional cleanup     |
