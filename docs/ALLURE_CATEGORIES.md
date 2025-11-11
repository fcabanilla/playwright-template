# Allure Test Categories - Failure Classification System

## Overview

This document describes the Allure test categories system used to automatically classify test failures in the Cinesa Playwright test framework. Categories help identify patterns in test failures and prioritize fixes.

**Location:** `.allure/categories.json` (versioned in Git)

**Deployment:** Automatically copied to `.allure/results/categories.json` before report generation

**Official Documentation:** <https://allurereport.org/docs/categories/>

## How It Works

### File Location Strategy

Allure requires `categories.json` in the **results directory** (`.allure/results/`) during report generation. However, this directory is temporary and cleaned between test runs.

**Our Solution:**

1. **Source file:** `.allure/categories.json` (versioned in Git via `.gitignore` exception)
2. **Deployment:** `npm run report:copy-categories` copies to `.allure/results/categories.json`
3. **Automation:** Integrated into `npm run report` workflow

**NPM Script Workflow:**

```bash
npm run report
# Executes in order:
# 1. npm run report:copy-categories  → Copy categories.json to results/
# 2. npm run report:copy-history     → Copy history for trend graphs
# 3. npm run report:generate         → Generate Allure HTML report
# 4. npm run report:open             → Open report in browser
```

### Git Configuration

The `.allure/` directory is ignored by default, but we make an **exception** for `categories.json`:

```gitignore
# .gitignore
.allure/
!.allure/categories.json  # Exception: version this file
```

## How Categories Work

Allure categories automatically classify failed/broken tests based on:
- **Status:** `broken` (infrastructure/test issues) or `failed` (product defects)
- **Error Messages:** Regex patterns matching exception messages
- **Stack Traces:** Regex patterns matching stack traces

When a test fails, Allure evaluates categories **in order** and assigns the **first matching** category.

## Current Categories (Priority Order)

### 1. Test Timeouts
**Priority:** 🔴 Critical - Infrastructure Issue

**Pattern:**
```json
{
  "name": "Test Timeouts",
  "matchedStatuses": ["broken"],
  "messageRegex": ".*Test timeout of 90000ms exceeded.*"
}
```

**Characteristics:**
- Tests exceeding 90-second timeout
- Usually affects Grancasa cinema tests
- Indicates severe performance or infrastructure problems

**Affected Tests:**
- `bar/bar.spec.ts` - Classic menu tests (Grancasa)
- `seatPicker/seatPicker.spec.ts` - Multiple seat selection (Grancasa)

**Action Required:** Investigate infrastructure issues, consider increasing timeout for specific tests, or optimize page load performance.

---

### 2. Page Closed Errors
**Priority:** 🔴 Critical - Stability Issue

**Pattern:**
```json
{
  "name": "Page Closed Errors",
  "matchedStatuses": ["broken", "failed"],
  "messageRegex": ".*(Target page, context or browser has been closed).*"
}
```

**Characteristics:**
- Unexpected browser/page/context closure
- 100% of cases occur in Grancasa cinema tests
- Happens during seat retrieval from DOM

**Affected Tests:**
- `bar/bar.spec.ts` - Buy ticket with Classic menu (Grancasa)
- `seatPicker/seatPicker.spec.ts` - Full purchase with multiple seats (Grancasa)

**Root Cause:** Grancasa cinema page may have JavaScript errors or unexpected navigation during seat loading.

**Action Required:** Add browser console error logging, implement retry logic for seat retrieval, investigate Grancasa-specific frontend issues.

---

### 3. D-BOX Availability Issues
**Priority:** 🟡 Medium - Test Data Issue

**Pattern:**
```json
{
  "name": "D-BOX Availability Issues",
  "matchedStatuses": ["failed"],
  "messageRegex": ".*No D-BOX films with showtimes found on the cinema detail page.*"
}
```

**Characteristics:**
- Tests expecting D-BOX format films
- Grancasa cinema doesn't have D-BOX showtimes available
- Expected behavior in production

**Affected Tests:**
- `seatPicker/seatPicker.spec.ts` - D-BOX sofa seat selection tests (Grancasa)

**Action Required:**
- Skip D-BOX tests for cinemas without this format
- Update test parametrization to check cinema capabilities before execution
- Consider using cinema configuration in `config/cinemas.config.ts`

---

### 4. Promotional Code Issues
**Priority:** 🟠 High - Product Defect (Potential)

**Pattern:**
```json
{
  "name": "Promotional Code Issues",
  "matchedStatuses": ["failed"],
  "messageRegex": ".*(waiting for locator.*ABCD.*to be visible).*"
}
```

**Characteristics:**
- Tests failing when selecting promotional codes
- Dropdown options (e.g., "ABCD") not appearing
- Cookie banner may be interfering (see history: passed after cookie accepted)

**Affected Tests:**
- `seatPicker/seatPicker.spec.ts` - Full purchase with standard promotional code (Oasiz)

**Action Required:**
- Verify promotional codes are active in production
- Add explicit wait for dropdown to be fully loaded
- Investigate if cookie banner overlay blocks interaction

---

### 5. Seat Selection Logic Errors
**Priority:** 🟠 High - Product Defect

**Pattern:**
```json
{
  "name": "Seat Selection Logic Errors",
  "matchedStatuses": ["failed"],
  "messageRegex": ".*(No suitable seats found for the group).*"
}
```

**Characteristics:**
- Algorithm fails to find seats matching criteria
- Affects tests with complex seat selection rules (separating groups, companion seats)

**Affected Tests:**
- `seatPicker/seatPicker.spec.ts` - Select seats separating group in different rows (Grancasa)

**Action Required:**
- Review seat selection algorithm in `seatPicker.page.ts`
- Add fallback logic for edge cases
- Consider using less restrictive selection criteria in tests

---

### 6. Cookie Banner Handling
**Priority:** 🟢 Low - Non-Critical

**Pattern:**
```json
{
  "name": "Cookie Banner Handling",
  "matchedStatuses": ["failed"],
  "messageRegex": ".*waiting for locator.*onetrust-banner-sdk.*to be visible.*"
}
```

**Characteristics:**
- Cookie banner sometimes doesn't appear (already accepted in previous session)
- Test continues normally after timeout (3 seconds)
- Not a blocking failure

**Affected Tests:**
- Various tests with `cookieBanner.acceptAllCookies()` in beforeEach

**Current Mitigation:** Implemented in `cookieBanner.page.ts` with 3-second timeout and graceful continuation.

**Action Required:** None - working as designed.

---

### 7. Strict Mode Violations
**Priority:** 🟠 High - Test Quality Issue

**Pattern:**
```json
{
  "name": "Strict Mode Violations",
  "matchedStatuses": ["failed"],
  "messageRegex": ".*strict mode violation.*resolved to \\d+ elements.*"
}
```

**Characteristics:**
- Selector matches multiple elements
- Playwright's strict mode prevents ambiguous clicks
- Example: `.v-number-input__button--plus` matches 5 ticket type buttons

**Affected Tests:**
- `bar/bar.spec.ts` - Buy ticket with Classic menu (Oasiz)

**Action Required:**
- Refine selectors to be more specific
- Use `first()`, `nth()`, or filter methods
- Update `*.selectors.ts` files with unique selectors

---

### 8. Grancasa Cinema Issues
**Priority:** 🔴 Critical - Infrastructure

**Pattern:**
```json
{
  "name": "Grancasa Cinema Issues",
  "matchedStatuses": ["broken", "failed"],
  "traceRegex": ".*Grancasa.*"
}
```

**Characteristics:**
- Catch-all category for Grancasa-specific problems
- Combines timeouts, page closures, and stability issues
- 90%+ failure rate in Grancasa vs. 5% in Oasiz

**Action Required:**
- Isolate Grancasa tests in separate test runs
- Add cinema-specific retry logic
- Consider marking Grancasa tests with `@grancasa-unstable` tag
- Escalate to Grancasa cinema technical team

---

### 9. Product Defects
**Priority:** 🔴 Critical - Development Team

**Pattern:**
```json
{
  "name": "Product Defects",
  "matchedStatuses": ["failed"]
}
```

**Characteristics:**
- Genuine bugs in the application
- Tests correctly identify incorrect behavior
- Requires developer fix

**Action Required:** Create JIRA tickets, assign to development team.

---

### 10. Test Infrastructure Issues
**Priority:** 🟡 Medium - Test Maintenance

**Pattern:**
```json
{
  "name": "Test Infrastructure Issues",
  "matchedStatuses": ["broken"]
}
```

**Characteristics:**
- Test framework problems
- Configuration issues
- Flaky test patterns

**Action Required:** Refactor tests, improve webActions reliability, review Playwright configuration.

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
- **What's the main issue?** (e.g., "70% failures are Test Timeouts")
- **Which cinema is problematic?** (e.g., "Grancasa Cinema Issues" category)
- **Are failures test bugs or product bugs?** (e.g., "Product Defects" vs. "Test Infrastructure Issues")

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
  { "name": "D-BOX Availability Issues", "messageRegex": ".*D-BOX.*" },  // Specific
  { "name": "Product Defects", "matchedStatuses": ["failed"] }          // Generic (catches all)
]
```

### Regex Pattern Tips

- **Escape special characters:** `\.`, `\(`, `\)`
- **Case-insensitive:** Most patterns use `.*` to match any prefix/suffix
- **Multi-line support:** Use `.*` to span multiple lines
- **Test regex:** Use https://regex101.com/ with sample error messages

---

## Integration with Test Tags

Categories complement the tag system:

| Tag             | Allure Category                  | Purpose                                |
|-----------------|----------------------------------|----------------------------------------|
| `@broken-prod`  | Test Timeouts, Page Closed Errors| Severe failures requiring urgent fix   |
| `@failed-prod`  | Product Defects, Seat Logic Errors| Minor failures requiring investigation |
| `@grancasa`     | Grancasa Cinema Issues           | Cinema-specific problems               |
| `@smoke`        | N/A                              | Critical path tests (should never fail)|

---

## Examples from Recent Execution

### Test Timeout Example

**Test:** `bar/bar.spec.ts` - Buy multiple tickets with Classic menu (Oasiz)

**Error:**
```
Test timeout of 90000ms exceeded.
```

**Category Assigned:** `Test Timeouts`

**Action:** Increase timeout to 120s or optimize page load.

---

### Page Closed Example

**Test:** `seatPicker/seatPicker.spec.ts` - Full purchase with multiple seats (Grancasa)

**Error:**
```
Error: locator.getAttribute: Target page, context or browser has been closed
Call log:
  - waiting for locator('.v-seat-picker-seat').nth(119)
```

**Category Assigned:** `Page Closed Errors`

**Action:** Add browser console logging to capture JavaScript errors.

---

### D-BOX Availability Example

**Test:** `seatPicker/seatPicker.spec.ts` - D-BOX sofa seat selection (Grancasa)

**Error:**
```
Error: No D-BOX films with showtimes found on the cinema detail page
```

**Category Assigned:** `D-BOX Availability Issues`

**Action:** Skip test for cinemas without D-BOX support.

---

## Related Documentation

- **Allure Official Docs:** https://allurereport.org/docs/categories/
- **Test Tags Strategy:** `docs/TEST_TAGS_STRATEGY.md`
- **Allure Workflow:** `docs/ALLURE_WORKFLOW_CRITICAL.md`
- **Allure Directory Structure:** `docs/ALLURE_DIRECTORY_STRUCTURE.md`

---

## Changelog

### 2025-01-11 - Initial Categories
- Created 10 categories based on production test results analysis
- Prioritized by failure frequency and impact
- Aligned with @broken-prod and @failed-prod tags
