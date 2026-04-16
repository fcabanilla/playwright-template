---
name: testplan
description: 'Generate and run Allure test plans for selective test execution. Use when: re-running failed tests from a previous execution, selecting tests by tag/component/status, creating custom test subsets, understanding ALLURE_TESTPLAN_PATH workflow, debugging why testplan filtering is not working.'
argument-hint: 'Describe which tests to include: failed tests, a tag like @smoke, or a component name'
---

# Allure Test Plan — Selective Test Execution

## When to Use

- **Re-run failures**: After a regression, re-run only the failed/broken tests without re-executing everything
- **Tag-based selection**: Execute only `@smoke`, `@critical`, or any tag subset from previous results
- **Component isolation**: Re-run tests for a specific component (seatPicker, navbar, etc.)
- **Custom subsets**: Build arbitrary test selections combining status + tag + component filters
- **Troubleshooting**: Debug why testplan filtering is not working as expected

## How It Works

The `ALLURE_TESTPLAN_PATH` mechanism is a native feature of `allure-playwright` that integrates with Playwright's `grep` configuration:

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────┐     ┌──────────────┐
│ Allure Results   │────→│ generate-testplan │────→│ testplan.json  │────→│ Playwright   │
│ .allure/results/ │     │ (filter & select)│     │ (test subset)  │     │ grep filter  │
└─────────────────┘     └──────────────────┘     └────────────────┘     └──────────────┘
```

**Step by step:**

1. **Previous test run** generates result JSON files in `.allure/results/`, each containing `fullName`, `testCaseId`, `status`, and `labels`
2. **`generate-testplan.cjs`** reads those results, applies filters (status, tag, component), and writes a `testplan.json`
3. **`testPlanFilter()`** (from `allure-playwright/dist/testplan`) reads `testplan.json` when `ALLURE_TESTPLAN_PATH` is set
4. It converts each test's `selector` into a **RegExp** that feeds Playwright's native `grep` config
5. **Tests not matching any regex are NEVER EXECUTED** — this is real filtering, not just report metadata

**When `ALLURE_TESTPLAN_PATH` is NOT set**, `testPlanFilter()` returns `undefined` → no filtering → all tests run normally. This is fully backwards compatible.

## Prerequisites

- Previous test results must exist in `.allure/results/` (run tests at least once first)
- The `grep: testPlanFilter()` line must be in `playwright.config.ts` (already configured)

## Procedure: Re-run Failed Tests

The most common workflow — re-running only failures from a previous regression:

```bash
# Step 1: You already ran a regression and have results in .allure/results/
# (Do NOT clean results — the script reads them)

# Step 2: Generate a testplan with only failed/broken tests
npm run testplan:failed

# Step 3: Preview what will run (optional, recommended)
cat testplan.json | head -50

# Step 4: Run ONLY the failed tests
npm run testplan:run:cinesa
# Equivalent to: ALLURE_TESTPLAN_PATH=./testplan.json npx playwright test --project='Cinesa'

# Step 5: Generate report (results accumulate — old passed + new retried)
npm run report

# Step 6: Clean up the testplan when done
npm run testplan:clean
```

## Procedure: Tag-based Selection

Run only tests with specific Allure tags from previous results:

```bash
# Generate plan with @smoke tests
npm run testplan:smoke

# Or use the script directly for custom tags
node scripts/generate-testplan.cjs --tag @critical --tag @e2e

# Run the plan
npm run testplan:run:cinesa
```

## Procedure: Component Isolation

Re-run tests for a specific component:

```bash
# Failed seatPicker tests only
node scripts/generate-testplan.cjs --failed --component seatPicker

# All navbar tests regardless of status
node scripts/generate-testplan.cjs --status passed,failed,broken --component navbar

# Run
npm run testplan:run:cinesa
```

## Procedure: List Matching Tests (Dry Run)

Preview which tests would be included without writing a file:

```bash
# List all failed tests
node scripts/generate-testplan.cjs --failed --list

# List failed seatPicker tests
node scripts/generate-testplan.cjs --failed --component seatPicker --list
```

Output shows status icon, test name, and fullName selector for each match.

## Script Reference

```bash
node scripts/generate-testplan.cjs [options]

# Filter options (combine for AND logic between types):
  --failed                   # status ∈ {failed, broken}
  --passed                   # status ∈ {passed}
  --status <s1,s2>           # Custom status list (comma-separated)
  --tag <tag>                # Allure tag label (repeatable, OR within tags)
  --component <name>         # File path contains <name>
  --file <path>              # Exact file path match

# Output options:
  --output, -o <path>        # Custom output path (default: ./testplan.json)
  --list                     # Print to stdout instead of file

# Help:
  --help, -h
```

## npm Scripts

| Script                        | Description                                  |
| ----------------------------- | -------------------------------------------- |
| `npm run testplan:failed`     | Generate plan with failed/broken tests       |
| `npm run testplan:passed`     | Generate plan with passed tests              |
| `npm run testplan:smoke`      | Generate plan with @smoke tagged tests       |
| `npm run testplan:list`       | List tests (requires additional filter args) |
| `npm run testplan:run`        | Execute tests from testplan.json             |
| `npm run testplan:run:cinesa` | Execute Cinesa tests from testplan.json      |
| `npm run testplan:run:uci`    | Execute UCI tests from testplan.json         |
| `npm run testplan:clean`      | Delete testplan.json                         |

## Testplan JSON Format

See [testplan-schema.md](./references/testplan-schema.md) for the complete schema reference.

```json
{
  "version": "1.0",
  "tests": [
    {
      "id": "7413d32af7144e232d3c75fc7d734ce7",
      "selector": "seatPicker/seatPicker.spec.ts#Seat Picker - Seat Selection ..."
    }
  ]
}
```

- **`id`**: The `testCaseId` (MD5 hash) — used for tracking, not for matching
- **`selector`**: The `fullName` from Allure results — this is what Playwright matches against

## Troubleshooting

### Tests not being filtered (all tests run)

1. **Check env var is set**: `echo $ALLURE_TESTPLAN_PATH` — must point to existing file
2. **Check file exists**: `ls -la testplan.json`
3. **Check file has tests**: `cat testplan.json | python3 -c "import sys,json; print(len(json.load(sys.stdin)['tests']))"`
4. **Check grep in config**: Verify `grep: testPlanFilter()` is in `playwright.config.ts`

### No tests matched the filters

- **No results**: Run tests first to populate `.allure/results/`
- **Wrong status**: Check actual statuses with `node scripts/generate-testplan.cjs --status passed,failed,broken,skipped --list`
- **Tag mismatch**: Tags must include the `@` prefix: `--tag @smoke` not `--tag smoke`

### Selector mismatch (testplan has tests but Playwright skips them)

The `selector` format depends on the test structure. If tests were renamed or moved after generating results:

1. Re-run all tests to get fresh results
2. Regenerate the testplan

### Tests accumulate in Allure results

This is by design. Old results + new retries merge in the report. To start fresh:

```bash
npm run report:clean:results
# Run full regression again
```

## Integration with Report Workflow

The testplan workflow fits into the existing report cycle:

```
Full regression → Report → Identify failures → Generate testplan → Re-run failures → Report again
     ↑                                                                                    ↓
     └──────────────────────── (iterate until all pass) ───────────────────────────────────┘
```

**Key**: Do NOT run `npm run report:clean:results` between the full regression and the re-run. The accumulation ensures the final report shows both the original passes and the retried tests.
