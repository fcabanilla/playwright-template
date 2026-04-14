# ALLURE_TESTPLAN_PATH — Selective Test Execution

> Execute only specific tests from a previous Allure report: re-run failures, smoke subsets, or component-scoped tests.

## Overview

`ALLURE_TESTPLAN_PATH` is a native feature of `allure-playwright` that enables selective test execution based on a JSON file containing test identifiers. When the environment variable is set, Playwright **only executes tests listed in the plan** — all others are skipped entirely (not just hidden from the report).

### Architecture

```
Previous test run                Generate testplan             Run filtered tests
  .allure/results/    ─────→     testplan.json      ─────→    Only matching tests
  *-result.json               { version, tests[] }            ALLURE_TESTPLAN_PATH
```

The integration is already configured in `playwright.config.ts`:

```typescript
import { testPlanFilter } from 'allure-playwright/dist/testplan';

export default defineConfig({
  grep: testPlanFilter(),
  // ...
});
```

`testPlanFilter()` returns `undefined` when no testplan is set → all tests run normally. Fully backwards compatible.

## Quick Start

### Re-run Failed Tests

```bash
# 1. Generate testplan from last results (do NOT clean results first)
npm run testplan:failed

# 2. Run only the failed tests
npm run testplan:run:cinesa

# 3. Clean up
npm run testplan:clean
```

### Run Smoke Subset

```bash
npm run testplan:smoke
npm run testplan:run:cinesa
npm run testplan:clean
```

## Generator Script

**File**: `scripts/generate-testplan.cjs`

### Filters

| Flag                 | Description                                 | Example                          |
| -------------------- | ------------------------------------------- | -------------------------------- |
| `--failed`           | Tests with `status: failed\|broken`         | `npm run testplan:failed`        |
| `--passed`           | Tests with `status: passed`                 | `npm run testplan:passed`        |
| `--status <list>`    | Custom status filter (comma-separated)      | `--status failed,broken,skipped` |
| `--tag <tag>`        | Tests with specific Allure tag (repeatable) | `--tag @smoke --tag @critical`   |
| `--component <name>` | Tests whose file path contains `<name>`     | `--component seatPicker`         |
| `--file <path>`      | Tests from specific spec file               | `--file signup/signup.spec.ts`   |

- **AND logic** between different filter types: `--failed --component seatPicker` = failed seatPicker tests only
- **OR logic** between tags: `--tag @smoke --tag @critical` = tests with either tag

### Options

| Flag                  | Description                              | Default           |
| --------------------- | ---------------------------------------- | ----------------- |
| `--output, -o <path>` | Output file path                         | `./testplan.json` |
| `--list`              | Print matching tests to stdout (dry run) | -                 |
| `--help, -h`          | Show help                                | -                 |

### Examples

```bash
# List failed tests (dry run)
node scripts/generate-testplan.cjs --failed --list

# Failed seatPicker tests only
node scripts/generate-testplan.cjs --failed --component seatPicker

# Smoke tests that passed (for verification)
node scripts/generate-testplan.cjs --passed --tag @smoke

# All tests for a specific file
node scripts/generate-testplan.cjs --status passed,failed,broken,skipped --file navbar/navbar.spec.ts
```

## npm Scripts

| Script                                 | Command                                   |
| -------------------------------------- | ----------------------------------------- |
| `npm run testplan:failed`              | Generate plan from failed/broken tests    |
| `npm run testplan:passed`              | Generate plan from passed tests           |
| `npm run testplan:smoke`               | Generate plan from @smoke tagged tests    |
| `npm run testplan:component -- <name>` | Generate plan for a component             |
| `npm run testplan:list -- <filters>`   | List matching tests (append filter flags) |
| `npm run testplan:run`                 | Execute tests using testplan.json         |
| `npm run testplan:run:cinesa`          | Execute Cinesa tests using testplan.json  |
| `npm run testplan:run:uci`             | Execute UCI tests using testplan.json     |
| `npm run testplan:clean`               | Delete testplan.json                      |

## Testplan JSON Format

```json
{
  "version": "1.0",
  "tests": [
    {
      "id": "7413d32af7144e232d3c75fc7d734ce7",
      "selector": "seatPicker/seatPicker.spec.ts#Seat Picker - Seat Selection Seat Selection Validation Seat Picker · Seat Selection · Attempt selection · Separate group same row — Oasiz"
    }
  ]
}
```

- **`id`**: `testCaseId` from Allure results (MD5 hash) — used for tracking
- **`selector`**: `fullName` from Allure results — used for Playwright `grep` matching
- **`version`**: Must be `"1.0"`

### Selector Format

```
<relative-file-path>#<describe-blocks> <test-title>
```

Example: `navbar/navbar.spec.ts#Navbar - Main Navigation Navbar · Visibility · Display all elements`

## Workflows

### Workflow 1: Failure Investigation Loop

After a full regression run with failures:

```bash
# 1. DON'T clean results — we need them
# 2. Generate testplan
npm run testplan:failed

# 3. Optional: preview
node scripts/generate-testplan.cjs --failed --list

# 4. Re-run only failures (with debug options as needed)
ALLURE_TESTPLAN_PATH=./testplan.json npx playwright test --project='Cinesa' --headed --workers=1

# 5. Generate report (old passes + new retries merge)
npm run report

# 6. If still failures, iterate from step 2
# 7. When done, clean up
npm run testplan:clean
```

### Workflow 2: Environment-Specific Re-run

```bash
# Re-run failures against a different environment
npm run testplan:failed
cross-env TEST_ENV=preprod ALLURE_TESTPLAN_PATH=./testplan.json npx playwright test --project='Cinesa'
npm run testplan:clean
```

### Workflow 3: Component Deep-Dive

```bash
# Focus on a specific component
node scripts/generate-testplan.cjs --status passed,failed,broken --component seatPicker
npm run testplan:run:cinesa
npm run testplan:clean
```

## Important Notes

### Results Accumulation

Allure accumulates results by design. When re-running failures:

- Old passed results remain in `.allure/results/`
- New retry results are added alongside
- The generated report merges both → shows overall picture

**Only clean results when starting a completely fresh regression**, not between testplan iterations.

### Deduplication

The generator script deduplicates by `testCaseId` — if multiple results exist for the same test (e.g., retries), it keeps the most recent one.

### Backwards Compatibility

When `ALLURE_TESTPLAN_PATH` is not set:

- `testPlanFilter()` returns `undefined`
- `grep: undefined` → Playwright applies no filter
- All tests run as before

### Manual Testplan

You can create `testplan.json` manually for specific test selection:

```json
{
  "version": "1.0",
  "tests": [
    {
      "id": "1",
      "selector": "navbar/navbar.spec.ts#Navbar - Main Navigation Navbar · Visibility · Display all elements"
    }
  ]
}
```

Then run: `ALLURE_TESTPLAN_PATH=./testplan.json npx playwright test`

## Troubleshooting

| Problem                        | Solution                                                                 |
| ------------------------------ | ------------------------------------------------------------------------ |
| All tests run despite testplan | Check `ALLURE_TESTPLAN_PATH` is set and file exists                      |
| No tests matched filters       | Run `--list` with broader filters to inspect available results           |
| Selector format wrong          | Regenerate from fresh test results (selectors depend on test names)      |
| "No result files found"        | Run tests first to populate `.allure/results/`                           |
| Old tests in testplan          | Clean results first (`npm run report:clean:results`), re-run, regenerate |

## Related Documentation

- [Allure Playwright Official Docs](https://allurereport.org/docs/playwright/)
- [ALLURE_CATEGORIES.md](./ALLURE_CATEGORIES.md) — Category configuration
- [ALLURE_DIRECTORY_STRUCTURE.md](./ALLURE_DIRECTORY_STRUCTURE.md) — Directory layout
- [ALLURE_WORKFLOW_CRITICAL.md](./ALLURE_WORKFLOW_CRITICAL.md) — Results accumulation behavior

## Files

| File                                                    | Purpose                                       |
| ------------------------------------------------------- | --------------------------------------------- |
| `scripts/generate-testplan.cjs`                         | Testplan generator script                     |
| `playwright.config.ts`                                  | Contains `grep: testPlanFilter()` integration |
| `.github/skills/testplan/SKILL.md`                      | Copilot skill for testplan workflow           |
| `.github/skills/testplan/references/testplan-schema.md` | JSON schema reference                         |
| `.github/skills/testplan/assets/testplan.template.json` | Template file                                 |
