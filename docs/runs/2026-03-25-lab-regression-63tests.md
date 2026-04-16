# Lab Regression — Evidence-Backed Failure Diagnosis Report

**Branch**: `chore/reporter-results-stabilization`
**Environment**: Lab (`https://lab-web.ocgtest.es/`)
**Date**: 2026-03-25
**Method**: Playwright trace analysis via trace.playwright.dev (MCP browser tools)
**Total Tests**: 63 (47 pass, 13 fail, 3 skip)

---

## Executive Summary

| Category | Count | Tests |
|----------|:-----:|-------|
| Confirmed code bugs | 2 | D-BOX "Adult" pattern, Wheelchair filter |
| CMS/Environment data issues | 2 | Movies image undefined, Analytics no seats |
| API rate limiting | 3 | All Gift Card checkout tests (429) |
| Flaky (passed on re-run) | 4 | Single seat, Leave gap, Separate group, Blog |
| Not re-run (checkout — known 429) | 2 | Smoke credit card tests |

---

## Analysis Method

All non-checkout `@lab-fail` tests (8 tests) were re-executed with `--trace on --workers=1` to capture Playwright traces. Each trace was loaded into [trace.playwright.dev](https://trace.playwright.dev) via MCP Playwright browser tools. Action trees, error panels, DOM snapshots, and network logs were inspected for each failure.

**Checkout tests** (5) were NOT re-run — their root cause (HTTP 429 rate limit) was already documented with network evidence in a previous session. See [BUG-giftcard-429-rate-limit.md](docs/jira-bugs/BUG-giftcard-429-rate-limit.md).

---

## Re-Run Results (8 non-checkout tests)

| # | Test | Re-Run | Previous Diagnosis (code inference) | Trace Evidence | Correct? |
|---|------|:------:|-------------------------------------|----------------|:--------:|
| 1 | D-BOX ticket types | **FAIL** | "Adult" not in validTicketPatterns | Error at `seatPicker.assertions.ts:117`: `"Adult" is not a valid ticket type pattern` | ✅ |
| 2 | Single seat purchase | **PASS** | "Continue as Guest" timeout | All 22 steps completed. Payment page reached. Gift card POST in-flight. | ❌ Was flaky |
| 3 | Leave empty gap | **PASS** | Sofa selection logic bug | — | ❌ Was flaky |
| 4 | Separate group same row | **PASS** | Sofa row logic bug | — | ❌ Was flaky |
| 5 | Wheelchair only | **FAIL** | No wheelchair seats filtered wrong | Error at `seatPicker.page.ts:1264`. DOM shows 3 wheelchair seats available (2-14, 2-12, 2-7). | ✅ Confirmed but root cause different |
| 6 | Analytics GA4 | **FAIL** | DataLayer timing | Error: "No available seats found". DOM shows ALL seats "Unavailable" in selected showtime. | ❌ Was seat availability |
| 7 | Blog roundtrip | **PASS** | Blog CMS data issue | — | ❌ Was flaky |
| 8 | Movies schema URL | **FAIL** | CMS null image URL | Error at `movies.assertions.ts:60`: image URL is `https://lab-web.ocgtest.esundefined` | ✅ |

**Accuracy of code-inference diagnoses: 3/8 (37.5%)** — This validates the user's challenge that trace-based evidence is essential.

---

## Detailed Findings by Root Cause

### 1. CODE BUG: "Adult" Ticket Type Not in Pattern List

**Tests affected**: `Seat Picker · D-BOX · Display · Regular & sofa ticket types — Oasiz`

**Trace evidence**:
- Trace file: `seatPicker-...-2f542-r-sofa-ticket-types-—-Oasiz-Cinesa/trace.zip`
- Error tab: `Error: The ticketTypeName "Adult" is not a valid ticket type pattern and is not included in the mappings`
- Source: `seatPicker.assertions.ts:117`

**Root cause**: The `validTicketPatterns` array (lines 88-105) contains 17 Spanish regex patterns but NO English pattern for "Adult". The Lab environment returns English ticket type names for some configurations. Same bug class as the RECLINER+ fix from Batch 2.

**Fix**: Add `/^-?Adult$/i` to the `validTicketPatterns` array in `seatPicker.assertions.ts`.

---

### 2. CODE BUG: `getAvailableSeats()` Excludes Wheelchair Seats

**Tests affected**: `Seat Picker · Accessibility · Select seats · Wheelchair only — Oasiz`

**Trace evidence**:
- Trace file: `seatPicker-...-f4370-s-·-Wheelchair-only-—-Oasiz-Cinesa/trace.zip`
- Error tab: `Error: No available wheelchair seats found` at `seatPicker.page.ts:1264`
- DOM snapshot at failure: **3 wheelchair seats visible and clickable** (`Wheelchair space 2-14`, `2-12`, `2-7` — all with `cursor=pointer`)

**Root cause**: `getAvailableSeats()` (line 428-429) explicitly filters OUT wheelchair and companion seats:
```typescript
return allSeats.filter(
  (s) => s.seatState === 'available' &&
         s.seatType !== 'wheelchair' &&  // ← Removed here
         s.seatType !== 'companion'      // ← Removed here
);
```
Then `selectRandomAvailableWheelchairSeat()` (line 1259) calls `getAvailableSeats()` and filters for `seatType === 'wheelchair'` — which will **always be empty**.

**Fix**: Use `getAllSeats()` instead of `getAvailableSeats()` in `selectRandomAvailableWheelchairSeat()`, then filter for available wheelchair seats:
```typescript
const allSeats = await this.getAllSeats();
const wheelchairSeats = allSeats.filter(
  (seat) => seat.seatType === 'wheelchair' && seat.seatState === 'available'
);
```

---

### 3. ENVIRONMENT: All Regular Seats Unavailable

**Tests affected**: `GA4 · Data Layer · Validate events · Classic menu — Oasiz`

**Trace evidence**:
- Trace file: `analytics-...-e34aa-ents-·-Classic-menu-—-Oasiz-Cinesa/trace.zip`
- Error tab: `Error: No available seats found`
- DOM snapshot: ALL standard seats show as `"Unavailable seat X-Y"`. Only wheelchair (3) and companion (2) seats were clickable, but those are excluded by `getAvailableSeats()`.

**Root cause**: The randomly selected showtime was fully sold out (all regular seats occupied). Combined with `getAvailableSeats()` excluding wheelchair/companion, zero seats are returned.

**Mitigation**: Add retry logic when selecting a film/showtime — if all seats are unavailable, try a different showtime. Or use a pre-validated showtime with known availability for analytics tests.

---

### 4. CMS DATA: Movie Schema Image URL Contains `undefined`

**Tests affected**: `Films · Schema · Validate URLs · Bug detection`

**Trace evidence**:
- Trace file: `movies-...-9589d-lidate-URLs-·-Bug-detection-Cinesa/trace.zip`
- Error tab: `Error: Movie image URL should not contain 'undefined': https://lab-web.ocgtest.esundefined` at `movies.assertions.ts:60`
- Action tree shows: Movie URL validation passed ✅, Movie image URL validation failed ❌
- Film: "Lightyear" (URL: `/peliculas/lightyear/HO00000082/` — valid)

**Root cause**: The "Lightyear" movie in Lab CMS has no poster image configured. The frontend constructs: `baseUrl + undefined` → `https://lab-web.ocgtest.esundefined`.

**JIRA Bug created**: [BUG-movies-schema-undefined-image.md](docs/jira-bugs/BUG-movies-schema-undefined-image.md)

---

### 5. API RATE LIMIT: Gift Card 429 (Checkout Tests)

**Tests affected** (5):
- `Checkout · Gift Card · Full Purchase with Post-Payment Verification — Oasiz`
- `Checkout · Gift Card · Nine Seats · Full Purchase with Post-Payment Verification — Oasiz`
- `Checkout · E2E · Multiple Seats · Gift Card — Oasiz`
- `Checkout · Smoke · Single Seat · Credit Card — Oasiz`
- `Checkout · Smoke · Multiple Seats · Credit Card — Oasiz`

**Evidence**: Network trace from previous session showed `OCAPI.Payments.AddGiftCardPayment` returning HTTP 429 with `blockedUntil` timestamp.

**JIRA Bug**: [BUG-giftcard-429-rate-limit.md](docs/jira-bugs/BUG-giftcard-429-rate-limit.md)

**Note**: The 2 Smoke credit card tests may not be related to 429 — they were not re-run. They likely fail for the same seat availability reasons or a different checkout issue. Should be verified separately.

---

### 6. FLAKY: Passed on Re-Run (4 tests)

| Test | Original Run | Re-Run | Likely Cause |
|------|:---:|:---:|---|
| Single seat purchase | FAIL | **PASS** | Timing/network variance in payment flow |
| Leave empty gap | FAIL | **PASS** | Sofa seat availability differs per session |
| Separate group same row | FAIL | **PASS** | Sofa seat availability differs per session |
| Blog roundtrip | FAIL | **PASS** | CMS content loading timing |

These tests are inherently flaky due to dependency on real-time seat availability and CMS content. Consider:
- Adding retry mechanisms for seat/showtime selection
- Using `test.describe.configure({ retries: 1 })` for these specific tests

---

## Action Items Summary

| Priority | Action | Type | Effort |
|:--------:|--------|------|:------:|
| 🔴 | Add "Adult" to `validTicketPatterns` | Code fix | 5 min |
| 🔴 | Fix `selectRandomAvailableWheelchairSeat` to use `getAllSeats()` | Code fix | 10 min |
| 🟡 | Upload Lightyear poster in Lab CMS | CMS data fix | 5 min |
| 🟡 | Increase rate limit for OCAPI gift card endpoint in Lab | Infra request | External |
| 🟢 | Add showtime retry when all seats unavailable | Test resilience | 30 min |
| 🟢 | Add `retries: 1` for flaky seat-dependent tests | Test config | 5 min |

---

## JIRA Bug Reports Created

1. [BUG-giftcard-429-rate-limit.md](docs/jira-bugs/BUG-giftcard-429-rate-limit.md) — HTTP 429 on gift card payments
2. [BUG-movies-schema-undefined-image.md](docs/jira-bugs/BUG-movies-schema-undefined-image.md) — Movie image URL `undefined` in JSON-LD schema

---

## Key Lesson

Initial code-inference diagnoses had only **37.5% accuracy** compared to trace-based evidence. Trace analysis revealed:
- Single seat test was **not** a "Continue as Guest" timeout — it was flaky and passed on re-run
- Analytics test was **not** a DataLayer timing issue — it was sold-out seats
- Blog test was **not** a CMS data issue — it was flaky
- Wheelchair test root cause was **partially wrong** — the seats existed in DOM but were filtered by code

**Conclusion**: Always analyze traces before diagnosing. Code inference is useful for hypothesis generation but unreliable for diagnosis.
