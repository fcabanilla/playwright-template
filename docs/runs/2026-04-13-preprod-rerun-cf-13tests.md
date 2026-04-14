# Preprod Targeted Rerun — 13 CF-Blocked Tests

**Branch**: `project/praetor`
**Environment**: Preprod (`https://preprod-web.ocgtest.es/`)
**Date**: 2026-04-13
**Command**: `TEST_ENV=preprod npx playwright test --project='Cinesa' --grep '@rerun-cf' --workers=3`
**Duration**: 7.2 minutes
**Tag used**: `@rerun-cf` (temporary — to be removed after analysis)

---

## Summary

| Status | Count |
|--------|:-----:|
| Passed | 4 |
| Failed | 9 |
| **Total** | **13** |

**Pass rate**: 30.8%

---

## Context

The 13 previously CF-blocked tests from the production regression (all failed due to expired Cloudflare cookie — see [2026-04-13-production-regression-166tests.md](2026-04-13-production-regression-166tests.md)) were re-run against preprod to determine their actual test status.

A temporary `@rerun-cf` tag was added to all 13 tests for easy filtering. Cloudflare bypass worked correctly on preprod (headers + cookie auto-injected for `.ocgtest.es`).

---

## Results — Detailed

| # | Test | Time | Result | Preprod Tag | Error | Verdict |
|---|------|------|:------:|-------------|-------|---------|
| 1 | F&B · Classic Menu · Single ticket — Oasiz | 1.6m | **FAIL** | `@broken-prod` `@preprod-broken` | Timeout in booking flow | Expected |
| 2 | Blog · Landing · Display · All article cards | 47.3s | **PASS** | — | — | Expected |
| 3 | F&B · Classic Menu · Multiple tickets — Oasiz | 1.6m | **FAIL** | `@broken-prod` `@preprod-broken` | Timeout in booking flow | Expected |
| 4 | Checkout · Gift Card · Full Purchase — Oasiz | 3.1m | **FAIL** | `@preprod-broken` | "No films available" in Oasiz | Expected |
| 5 | Checkout · Smoke · Single Seat — Oasiz | 2.2m | **FAIL** | `@preprod-fail` | "No films available" in Oasiz | Expected |
| 6 | Checkout · Smoke · Multiple Seats — Oasiz | 1.8m | **FAIL** | `@preprod-fail` | Redsys 3DS simulator timeout | Expected |
| 7 | Films · Navigation · Browse · Random | 1.5m | **FAIL** | `@preprod-pass` | `page.goBack` timeout 30s | **UNEXPECTED** |
| 8 | Promotions · Page · Display & Layout | 40.5s | **FAIL** | `@preprod-broken` | `waitForLoadState('networkidle')` timeout 30s | Expected |
| 9 | SP · Complete Purchase · Single seat — Oasiz | 1.3m | **PASS** | `@broken-prod` `@preprod-broken` | — | **Better than expected** |
| 10 | SP · Seat Selection · Over capacity — Oasiz | 1.5m | **FAIL** | `@preprod-broken` | Seat [Row 10, Seat 1] not deselected after over-capacity | Expected |
| 11 | SP · D-BOX · Attempt · D-BOX unavailable — Oasiz | 46.7s | **PASS** | `@preprod-pass` | — | Expected |
| 12 | SP · D-BOX · Display · Regular & sofa tickets — Oasiz | 59.5s | **FAIL** | `@preprod-fail` | "-Precio MyCinesa DBOX" not in ticket type mappings | Expected |
| 13 | SP · Promo · Purchase · Standard codes — Oasiz | ~1m | **PASS** | `@failed-prod` | — | **Better than expected** |

---

## Analysis

### Cloudflare bypass: WORKING

All 13 tests successfully bypassed Cloudflare on preprod:
```
✅ [Cloudflare] Headers auto-injected for env=preprod
✅ [Cloudflare Bypass] Cookie injected (Secret only) for .ocgtest.es
```

No Cloudflare challenge pages were encountered. The production failures were confirmed as cookie-only issue.

### Failures by category

| Category | Count | Tests |
|----------|:-----:|-------|
| Infrastructure/timeout (expected broken) | 4 | Bar×2, Gift Card, Promotions |
| Checkout environment issue (expected fail) | 2 | Checkout Single (no films), Checkout Multiple (3DS) |
| Test logic / assertion mismatch (expected fail) | 2 | Over capacity (seat state), D-BOX Display (ticket mapping) |
| **Unexpected regression** | **1** | **Movies Random Browse (`page.goBack` timeout)** |

### 1 Unexpected Failure: Movies · Random Browse

Tagged `@preprod-pass` but failed. Error: `page.goBack: Timeout 30000ms exceeded` while navigating back from movie detail to `/peliculas/`. The browser context closed before completing the 3-movie navigation loop.

This may be:
- Preprod slowness on this specific run (transient)
- A regression in the movie navigation flow
- Need to verify with a solo re-run

### 2 Better-Than-Expected Passes

- **SP · Complete Purchase** (tagged `@preprod-broken`): Passed in 1.3m — the multi-day fallback and booking flow completed successfully
- **SP · Promo Codes** (tagged `@failed-prod`): Passed — promo code flow works on preprod

These tags may need updating.

---

## Tag Action Items

| Test | Current Tag | Suggested Action |
|------|-------------|------------------|
| SP · Complete Purchase — Oasiz | `@preprod-broken` | Consider upgrade to `@preprod-pass` if consistent |
| SP · Promo Purchase — Oasiz | `@failed-prod` | Production-only tag, preprod works fine |
| Movies · Random Browse | `@preprod-pass` | Investigate — may need `@preprod-fail` if regression confirmed |

---

## Allure Report Note

This run's results replaced the previous 166-test regression results in Allure (which had been wiped). The current Allure report shows ONLY these 13 tests.

---

## Next Steps

1. Generate Allure report: `npm run report`
2. Investigate Movies Random Browse failure (unexpected)
3. Address 9 failures one by one — classify and fix where possible
4. Remove `@rerun-cf` tag from all 13 tests after resolution
5. Re-run full production regression (with authorization) to recover lost data point
