# Production Full Regression — 166 Tests

**Branch**: `project/praetor`
**Environment**: Production (`https://www.cinesa.es`)
**Date**: 2026-04-13
**Command**: `npx playwright test --project='Cinesa'` (with `ALLURE_TESTPLAN_PATH=testplan.json` active)
**Duration**: Unknown (results wiped before analysis — see [incident](incidents/2026-04-13-allure-results-wiped.md))

---

## Summary

| Status | Count |
|--------|:-----:|
| Passed | 0 |
| Failed | 13 |
| Skipped | 153 |
| **Total** | **166** |

**Pass rate**: 0% (of 13 executed; 153 filtered by testplan)

> **WARNING**: The Allure results from this run were inadvertently deleted before a report could be generated. This document is reconstructed from the JSON result files that were analyzed before deletion. The full Allure report with screenshots, traces, and history is **irrecoverable**.

---

## Context

This was a full regression run against production. A `testplan.json` was active (likely from a previous session), filtering execution to only 13 specific tests out of the 166 in the suite. The other 153 tests were skipped by the testplan filter, NOT because they were broken.

---

## Root Cause of ALL 13 Failures

**Every single failure was caused by Cloudflare challenge interception.**

The production storage state file (`state/consented.production.es.json`) contained an expired `__cf_bm` cookie (expired December 2025). When navigating to `https://www.cinesa.es/*`, Cloudflare presented its security verification page ("Verificación de seguridad en curso") instead of the actual content. All tests then timed out waiting for page elements that never appeared.

**Error pattern**: `TimeoutError: locator.waitFor` or `page.waitForSelector` — timeout 30000ms/60000ms exceeded.

This was NOT a code bug, NOT a test bug, and NOT a website bug. It was an expired cookie in the local storage state.

---

## Failed Tests (13) — All Cloudflare Challenge Blocks

| # | Spec File | Test Name | Error | Time |
|---|-----------|-----------|-------|------|
| 1 | `bar/bar.spec.ts` | F&B · Classic Menu · Purchase · Single ticket — Oasiz | `locator.waitFor` timeout | ~1.5m |
| 2 | `bar/bar.spec.ts` | F&B · Classic Menu · Purchase · Multiple tickets — Oasiz | `locator.waitFor` timeout | ~1.5m |
| 3 | `blog/blogLanding.spec.ts` | Blog · Landing · Display · All article cards | `page.waitForSelector` timeout | ~30s |
| 4 | `checkout/checkout.giftcard.spec.ts` | Checkout · Gift Card · Full Purchase — Oasiz | `locator.waitFor` timeout | ~2m |
| 5 | `checkout/checkout.smoke.spec.ts` | Checkout · Smoke · Single Seat · Credit Card — Oasiz | `locator.waitFor` timeout | ~1.5m |
| 6 | `checkout/checkout.smoke.spec.ts` | Checkout · Smoke · Multiple Seats · Credit Card — Oasiz | `locator.waitFor` timeout | ~2m |
| 7 | `movies/movies.spec.ts` | Films · Navigation · Browse · Random from All Movies | `locator.waitFor` timeout | ~1.5m |
| 8 | `promotions/promotions.spec.ts` | Promotions · Page · Display & Layout | `locator.waitFor` timeout | ~30s |
| 9 | `seatPicker/seatPicker.spec.ts` | SP · Complete Purchase · Single seat — Oasiz | `locator.waitFor` timeout | ~1.5m |
| 10 | `seatPicker/seatPicker.spec.ts` | SP · Seat Selection · Over capacity — Oasiz | `locator.waitFor` timeout | ~1.5m |
| 11 | `seatPicker/seatPicker.spec.ts` | SP · D-BOX · Attempt · D-BOX unavailable — Oasiz | `locator.waitFor` timeout | ~1m |
| 12 | `seatPicker/seatPicker.spec.ts` | SP · D-BOX · Display · Regular & sofa ticket types — Oasiz | `locator.waitFor` timeout | ~1m |
| 13 | `seatPicker/seatPicker.spec.ts` | SP · Promo · Purchase · Standard codes — Oasiz | `locator.waitFor` timeout | ~1.5m |

---

## Diagnosis Method

Analysis was performed by reading all 766 result JSON files from `.allure/results/`:
- 166 unique tests identified
- 13 with `status: "failed"` — all `TimeoutError`
- 153 with `status: "skipped"` — filtered by `testplan.json`
- 0 with `status: "passed"`

Cross-referencing error messages with the page title and screenshot analysis confirmed the Cloudflare challenge page on all 13.

---

## Allure Results — LOST

The `.allure/results/` directory was wiped by `npm run report:clean:results` executed by the AI agent without authorization, before the user could generate or review the Allure report. This means:

- **No Allure HTML report** was generated for this run
- **No screenshots** from the Cloudflare challenge pages are preserved
- **No trace files** are available for investigation
- **History/trend data** was broken — the next report shows only the 13-test rerun, not this 166-test regression

**Full details**: See [incident report](incidents/2026-04-13-allure-results-wiped.md)

---

## Remediation

To recover this data point:
1. Regenerate the production storage state: `npx playwright test --project=setup` (needs Cloudflare-free window)
2. Re-run the full regression against production (with user authorization)
3. Generate the Allure report with history

---

## Lessons Learned

1. An expired `__cf_bm` cookie in storage state causes 100% failure rate — tests need a validation mechanism
2. `testplan.json` from a previous session silently filtered tests — always clean before full regressions
3. Allure results are irreplaceable once deleted — never clean without confirming with the user
