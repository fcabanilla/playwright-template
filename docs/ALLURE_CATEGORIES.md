# Allure Test Categories - Failure Classification System

## Overview

This document describes the Allure test categories system used to automatically classify test failures in the Cinesa Playwright test framework. Categories help identify patterns in test failures and prioritize fixes.

**Location:** `.allure/categories.json` (JSON configuration, versioned in git)

**Usage:** Copied to `.allure/results/categories.json` before report generation via `npm run report:copy-categories`

**Official Documentation:** <https://allurereport.org/docs/categories/>

## Architecture

### JSON-Based Approach

Categories are defined as a JSON file in `.allure/categories.json` and copied into the results directory before each report generation. This is the standard Allure approach.

**File Structure:**

```
.allure/
├── categories.json              # Category definitions (versioned)
├── results/                     # Test results (gitignored)
│   └── categories.json          # Copied here before report generation
└── report/                      # Generated HTML report
```

**Workflow:**

```bash
# Before report generation, categories are copied automatically:
npm run report:copy-categories   # cp .allure/categories.json .allure/results/categories.json

# Full report workflow (includes copy automatically):
npm run report                   # copy-categories → copy-history → generate → open
```

**Why JSON (not TypeScript):**

- Standard Allure mechanism — no custom build step needed
- Versioned in git via `.gitignore` exception (`!.allure/categories.json`)
- Simple to edit and validate
- Copied to results dir by a single `cp` command in npm scripts

## How Categories Work

Allure categories automatically classify failed/broken tests based on:

- **Status:** `broken` (infrastructure/test issues) or `failed` (product defects)
- **Error Messages:** Regex patterns matching exception messages (`messageRegex`)

When a test fails, Allure evaluates categories **in order** and assigns the **first matching** category.

## Current Categories (Priority Order)

### 1. Network / Environment

**Priority:** 🔴 Critical — Infrastructure Issue

**Pattern:**

```json
{
  "name": "Network / Environment",
  "matchedStatuses": ["failed", "broken"],
  "messageRegex": ".*(?:net::ERR_|ECONNRESET|ETIMEDOUT|ECONNREFUSED|socket hang up).*"
}
```

**Characteristics:**

- DNS resolution failures (`net::ERR_NAME_NOT_RESOLVED`)
- Connection resets or refused (`ECONNRESET`, `ECONNREFUSED`)
- Network changes mid-test (`net::ERR_NETWORK_CHANGED`)
- More common in lab/preprod due to environment instability

**Action Required:** Retry the test run. If persistent, escalate to infrastructure team.

---

### 2. Data / Content Availability

**Priority:** 🟡 Medium — Test Data Issue

**Pattern:**

```json
{
  "name": "Data / Content Availability",
  "matchedStatuses": ["failed"],
  "messageRegex": ".*(?:No D-BOX films|No suitable seats found|No .* found on the cinema).*"
}
```

**Characteristics:**

- Tests expecting specific content (D-BOX films, seat layouts) not available in the environment
- Expected in some cinemas that don't carry certain formats
- Not a product bug — a data/environment issue

**Affected Tests:**

- `seatPicker/seatPicker.spec.ts` — D-BOX seat selection tests
- `seatPicker/seatPicker.spec.ts` — Seat group selection tests

**Action Required:** Verify cinema capabilities before running format-specific tests. Use `config/cinemas.config.ts` to scope parametrization.

---

### 3. Test Timeouts

**Priority:** 🔴 Critical — Infrastructure Issue

**Pattern:**

```json
{
  "name": "Test Timeouts",
  "matchedStatuses": ["broken"],
  "messageRegex": ".*(?:Test timeout of \\d+ms exceeded).*"
}
```

**Characteristics:**

- Full test exceeded its timeout budget (usually 90s)
- Marked as `broken` (not `failed`) because the test didn't complete
- Indicates severe performance or infrastructure problems

**Action Required:** Investigate infrastructure issues, consider increasing timeout for specific tests, or optimize page load performance.

---

### 4. UI: Interaction Timeouts

**Priority:** 🟠 High — Stability Issue

**Pattern:**

```json
{
  "name": "UI: Interaction Timeouts",
  "matchedStatuses": ["failed", "broken"],
  "messageRegex": ".*(?:Timeout \\d+ms exceeded).*"
}
```

**Characteristics:**

- A specific Playwright action timed out: `locator.click`, `locator.waitFor`, `page.waitForSelector`, `browserContext.waitForEvent`
- Element did not appear or become interactive within the configured timeout
- Common in slow environments (lab, preprod)
- Covers both locator timeouts and context event timeouts (e.g. waiting for new tab)

**Action Required:**

- Check if element selectors are still valid (use `npx playwright codegen`)
- Consider increasing individual action timeouts for known slow pages
- Verify the page under test is functional manually

---

### 5. UI: Selectors / Strict Mode

**Priority:** 🟠 High — Test Quality Issue

**Pattern:**

```json
{
  "name": "UI: Selectors / Strict Mode",
  "matchedStatuses": ["failed", "broken"],
  "messageRegex": ".*(?:strict mode violation|resolved to \\d+ elements|detached from DOM).*"
}
```

**Characteristics:**

- Selector matches multiple elements (strict mode violation)
- Element was removed from DOM during interaction
- Requires more specific selectors

**Action Required:**

- Refine selectors to be more specific (use `first()`, `nth()`, or `filter()`)
- Update `*.selectors.ts` files with unique selectors
- If `detached from DOM`, add retry logic or wait for stable state

---

### 6. Infra / Browser

**Priority:** 🔴 Critical — Infrastructure Issue

**Pattern:**

```json
{
  "name": "Infra / Browser",
  "matchedStatuses": ["broken"],
  "messageRegex": ".*(?:Target page, context or browser has been closed|Target closed|Context closed|browserType\\.launch).*"
}
```

**Characteristics:**

- Browser, page, or context crashed or closed unexpectedly
- `browserType.launch` failure indicates browser binary issues
- Only matches `broken` status

**Action Required:** Check browser installation (`npx playwright install`), investigate JavaScript errors on the page, review test isolation.

---

### 7. Product Defects

**Priority:** 🔴 Critical — Development Team

**Pattern:**

```json
{
  "name": "Product Defects",
  "matchedStatuses": ["failed"]
}
```

**Characteristics:**

- Catch-all for test failures that don't match any specific pattern
- Genuine assertion failures: wrong URLs, incorrect values, missing elements
- Tests correctly identify incorrect behavior in the application

**Action Required:** Create JIRA tickets, assign to development team.

---

---

## Usage in Reports

### Viewing Categories in Allure Report

After generating the Allure report:

```bash
npm run report
```

Navigate to:

- **Categories** tab - See distribution of failures by category
- **Test Details** - Each failed test shows its assigned category

### Category Metrics

Categories help answer:

- **What's the main issue?** (e.g., "50% failures are UI: Interaction Timeouts")
- **Is it a real bug or environment noise?** (e.g., "Product Defects" vs. "Network / Environment")
- **Is content missing?** (e.g., "Data / Content Availability" — D-BOX, seats)

---

## Maintaining Categories

### When to Add a New Category

Add a new category when:

1. You identify a **new pattern** of failures (3+ tests with same error)
2. The pattern is **actionable** (different fix strategy than existing categories)
3. The pattern is **specific enough** to be useful (not too broad)

### Category Order Matters

Categories are evaluated **top-to-bottom**. More specific categories should come **before** generic ones.

**Example:**

```json
[
  { "name": "Data / Content Availability", "messageRegex": ".*(?:No D-BOX films|No suitable seats).*" },
  { "name": "UI: Interaction Timeouts", "messageRegex": ".*(?:Timeout \\d+ms exceeded).*" },
  { "name": "Product Defects", "matchedStatuses": ["failed"] }
]
```

### Regex Pattern Tips

- **Full-match semantics:** Allure Java uses `Pattern.matches()` — the regex must match the **entire** message. Always wrap patterns with `.*(?:...).*`
- **DOTALL mode:** Allure compiles with `DOTALL` flag — `.` matches newlines too
- **Case sensitive:** Java regex is case-sensitive by default
- **Test regex:** Use https://regex101.com/ (Java flavor) with sample error messages
- **Validate locally:** Run `node scripts/extract-errors.cjs` to test patterns against real results

---

## Integration with Test Tags

Categories complement the tag system:

| Tag        | Likely Allure Category         | Purpose                              |
| ---------- | ------------------------------ | ------------------------------------ |
| `@smoke`   | Product Defects (if failing)   | Critical path — should never fail    |
| `@e2e`     | UI: Interaction Timeouts       | Long flows more prone to timeouts    |
| `@fast`    | Product Defects                | Quick tests — timeouts are unlikely  |
| `@oasiz`   | Data / Content Availability    | Cinema-specific content issues       |

---

## Examples from Recent Execution

### D-BOX Content Not Available

**Test:** `seatPicker/seatPicker.spec.ts` — D-BOX sofa seat selection (Oasiz)

**Error:**

```
Error: No D-BOX films with showtimes found on the cinema detail page
```

**Category Assigned:** `Data / Content Availability`

**Action:** Verify D-BOX showtimes exist in the cinema. Skip test if format not available.

---

### Locator Timeout

**Test:** `bar/bar.spec.ts` — F&B Classic Menu purchase (Oasiz)

**Error:**

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('button.v-button.button-review') to be visible
```

**Category Assigned:** `UI: Interaction Timeouts`

**Action:** Check if the element selector is still valid, increase timeout if environment is slow.

---

### Test-Level Timeout

**Test:** `seatPicker/seatPicker.spec.ts` — Wheelchair seat selection (Oasiz)

**Error:**

```
Test timeout of 90000ms exceeded.
```

**Category Assigned:** `Test Timeouts`

**Action:** Investigate performance, consider increasing test timeout or optimizing flow.

---

## Related Documentation

- **Allure Official Docs:** https://allurereport.org/docs/categories/
- **Test Tags Strategy:** `docs/TEST_TAGS_STRATEGY.md`

---

## Changelog

### 2025-03-25 - Category Redesign

- Reduced to 7 cross-environment categories (was 10 with cinema-specific categories)
- Switched from `traceRegex` to `messageRegex` for reliable matching
- All regex patterns use `.*(?:...).*` wrapper (Allure Java full-match semantics)
- All regex patterns validated against real Allure result files
- Removed Grancasa-specific category (cinema removed from active testing)
- Added `Data / Content Availability` for D-BOX/seat content issues
- Added validation script: `scripts/extract-errors.cjs`

### 2025-01-11 - Initial Categories

- Created 10 categories based on production test results analysis
- Prioritized by failure frequency and impact
