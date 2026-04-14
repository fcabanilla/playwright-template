# Test Execution Runs — Registry

This directory contains the historical record of all significant test executions (regressions, targeted runs, reruns). Each run is documented with full results, errors, and observations to track project evolution over time.

---

## Naming Convention

```
YYYY-MM-DD-{environment}-{type}-{N}tests.md
```

| Field | Values |
|-------|--------|
| environment | `production`, `preprod`, `lab` |
| type | `regression` (full suite), `full` (full for platform), `rerun` (targeted subset), `smoke` |
| N | Number of tests executed |

**Examples:**
- `2026-04-13-preprod-rerun-cf-13tests.md`
- `2026-04-10-preprod-full-64tests.md`
- `2026-03-25-lab-regression-63tests.md`

---

## Run Index

| Date | Environment | Type | Tests | Pass | Fail | Broken | Skip | Report | Notes |
|------|-------------|------|:-----:|:----:|:----:|:------:|:----:|--------|-------|
| 2026-03-25 | Lab | Full regression | 63 | 47 | 13 | — | 3 | [Report](2026-03-25-lab-regression-63tests.md) | Trace analysis validated. 37.5% accuracy of code-inference vs traces |
| 2026-04-10 | Preprod | Full regression | 64 | 33 | 13 | 13 | 5 | [Report](2026-04-10-preprod-full-64tests.md) | Multi-day fallback working. 27 tag changes applied |
| 2026-04-13 | Production | Full regression | 166 | 0 | 13 | — | 153 | [Report](2026-04-13-production-regression-166tests.md) | ALL 13 failures = Cloudflare challenge. **Allure results lost** — see [incident](incidents/2026-04-13-allure-results-wiped.md) |
| 2026-04-13 | Preprod | Targeted rerun | 13 | 4 | 9 | — | — | [Report](2026-04-13-preprod-rerun-cf-13tests.md) | Re-verified CF-blocked tests. 8/9 failures match existing tags. 1 unexpected (Movies) |

---

## How to Read the Results

### Status definitions

| Status | Meaning |
|--------|---------|
| **Pass** | Test completed successfully — assertions passed |
| **Fail** | Test executed but assertions or business logic failed |
| **Broken** | Test could not complete — infrastructure timeout, navigation failure, environment issue |
| **Skip** | Test excluded by tag, testplan filter, or `test.skip()` |

### Verdict categories

| Verdict | Meaning |
|---------|---------|
| **Expected** | Failure matches its existing preprod/lab tag (`@preprod-broken`, `@preprod-fail`, etc.) |
| **Unexpected** | Test tagged as passing (`@preprod-pass`) but failed — potential regression |
| **New** | First time running this test in this environment — no prior tag to compare |
| **Infrastructure** | Timeout or navigation failure caused by environment slowness, not test logic |

---

## When to Document a Run

Document a run when:
- Running a **full regression** on any environment
- Running a **targeted rerun** to verify specific failures
- After making **tag changes** based on results
- Any time results should be **preserved for historical reference**

Do NOT document:
- Quick debug runs during development
- Single-test executions for troubleshooting

---

## Incidents

Significant incidents affecting test execution or data integrity are documented in the `incidents/` subdirectory.

| Date | Incident | Impact |
|------|----------|--------|
| 2026-04-13 | [Allure results wiped](incidents/2026-04-13-allure-results-wiped.md) | 166-test regression results lost. Report overwritten with 13-test rerun |

---

## Evolution Dashboard

### Preprod Pass Rate Over Time

| Date | Pass | Total | Rate | Delta |
|------|:----:|:-----:|:----:|:-----:|
| 2026-04-10 | 33 | 64 | 51.6% | baseline |
| 2026-04-13 (13 subset) | 4 | 13 | 30.8% | N/A (subset) |

### Lab Pass Rate Over Time

| Date | Pass | Total | Rate | Delta |
|------|:----:|:-----:|:----:|:-----:|
| 2026-03-25 | 47 | 63 | 74.6% | baseline |
