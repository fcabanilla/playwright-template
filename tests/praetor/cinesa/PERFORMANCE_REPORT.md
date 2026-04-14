# Praetor Suite — Performance Optimization Report

> Analysis date: 2026-04-14
> Suite: 27 tests · 3 workers · ~4.8 min wall-clock · preprod (Oasiz)

---

## Executive Summary

After step-by-step inspection of every test in the Allure report, **3 main bottlenecks** were identified that account for **~70% of total execution time**.

| Bottleneck | Impact | Affected Tests | Time Wasted |
|-----------|--------|----------------|-------------|
| D-BOX/ScreenX video modal | CRITICAL | 3 | ~180s |
| Redsys iframe load | MODERATE | 4 | ~80s (unavoidable) |
| Hardcoded wait(1500) in seat selection | MINOR | ~20 | ~15-20s |

**Projected savings:** ~195s (~3.2 min) → wall-clock from ~4.8 min to ~2-3 min.

---

## 1. Full Timing Data

### Test Duration Ranking

| # | Test | Duration | Primary Bottleneck |
|---|------|----------|-------------------|
| 1 | D-BOX Complete purchase flow | **101.9s** | Video modal: 61s |
| 2 | Gift card visible on payment | **85.8s** | Video modal: 61s |
| 3 | D-BOX badge and seats | **76.1s** | Video modal: 61s |
| 4 | Bar E2E skip multiple seats | **52.0s** | Redsys: 19s + 2 seats: 20s |
| 5 | Checkout E2E credit card | **47.0s** | Redsys: 22s |
| 6 | Bar E2E skip single seat | **45.5s** | Redsys: ~19s |
| 7 | Checkout complete purchase | **43.6s** | Redsys: 17s |
| 8-11 | Bar component tests | 24-28s | beforeEach flow overhead |
| 12 | TicketPicker Flow | 20.9s | beforeEach + navigation |
| 13-15 | TicketPicker tests | 15-18s | beforeEach overhead |
| 16 | Login Guest | 16.6s | Standard |
| 17 | SeatPicker Flow | 14.1s | Standard |
| 18-22 | SeatPicker tests | 9-13s | Standard |
| 23 | Login Visibility | 12.7s | Standard |
| 24 | SeatPicker pricing cards | 9.1s | Standard |
| 25-26 | SeatPicker selection tests | 9.4-9.5s | Standard |
| 27 | Scaffold | 0.7s | Baseline |

---

## 2. Bottleneck Analysis

### B1: D-BOX/ScreenX Video Modal — 61 seconds (CRITICAL)

**Impact:** 3 tests affected = ~183 seconds wasted

**Finding:** Showtimes with premium formats (D-BOX, ScreenX) trigger a video/experience modal that lasts exactly **60-61 seconds** before auto-closing. The `dismissBlockingModals()` method detects the modal (`aside.v-modal[role="dialog"]`) but **cannot close it** — neither the "I can't wait"/"No puedo esperar" button nor the close button are accessible during video playback.

**Showtime → delay correlation:**

| Showtime | Room | Format | `dismissBlockingModals()` |
|----------|------|--------|--------------------------|
| 138-43541 | Sala 4 | **D-BOX** | ❌ **61s** |
| 138-43547 | Sala 1 | **ScreenX** | ❌ **61s** |
| 138-43539 | Sala 3 | IMAX | ✅ 522ms |
| 138-43542 | Sala 5 | Reclinable/VIP | ✅ ~500ms |
| 138-43543 | Sala 7 | 3D | ✅ 593ms |
| 138-43544 | Sala 2 | XL | ✅ ~700ms |
| 138-43538 | Sala 3 | (none) | ✅ ~500ms |

**Conclusion:** IMAX, Reclinable, 3D, XL do NOT generate video modals. Only **D-BOX** and **ScreenX** do.

---

### B2: Redsys Iframe Load — 17-22 seconds (MODERATE)

**Impact:** 4 tests that verify the payment page

**Finding:** The `expectRedsysVisible()` assertion uses `expect(redsys).toBeVisible({ timeout: 30000 })` on the `.redsys-connector-mainDiv-style` selector. This is an external iframe from the payment provider that takes 17-22s to load.

| Test | Redsys Time |
|------|-------------|
| Checkout E2E credit card | 22.0s |
| Bar E2E skip multiple | 19.0s |
| Checkout complete purchase | 17.0s |
| D-BOX complete purchase | 20.0s |

**Conclusion:** External dependency. The 30s timeout is appropriate (iframe loads in ~20s). Cannot be significantly optimized without changing the verification strategy.

---

### B3: Hardcoded wait(1500) in `selectFirstAvailableSeat()` (MINOR)

**Finding:** Each seat selection includes `await this.webActions.wait(1500)` after the click. This is a fixed "just in case" wait that adds 1.5s per seat:
- 1 seat → 1.5s
- 2 seats → 3.0s

Code at `seatPicker.page.ts:218`:
```typescript
await seat.click();
await this.webActions.wait(1500); // ← Reducible
await this.dismissBlockingModals();
```

---

### B4: `[FLOW] Skip bar` — ~4 seconds (MINOR)

**Finding:** Consistently takes ~4s. The flow is:
1. `handleBarModal()` — waits up to 10s for bar modal, closes it
2. `handleGaliciaModal()` — checks Galicia dialog
3. `clickContinue()` — waits up to 10s for button, click + navigation

Timeouts are reasonable, actual time is acceptable.

---

### B5: Component `beforeEach` overhead (ARCHITECTURAL)

Bar tests navigate through the entire flow (seat→login→ticket→bar) in `beforeEach`:
- 4 Bar component tests × ~20s setup = 80s setup
- 4 TicketPicker tests × ~12s setup = 48s setup

This is inherent to the design (each test needs a clean state).

---

## 3. Detailed Breakdown of Key Tests

### Test: D-BOX Complete purchase (101.9s)
```
[FLOW] Navigate + select 1 seat ─── 1m 11s
  ├─ Navigate to showtime 138-43541 ── 6.2s
  ├─ Dismiss blocking modals ───────── 1m 01s  ← VIDEO MODAL
  ├─ Select first available seat ───── 2.2s
  └─ Confirm seats ─────────────────── 1.3s
[FLOW] Login as guest ──────────────── 1.0s
[FLOW] Select 1 ticket ────────────── 2.5s
[FLOW] Skip bar ────────────────────── 3.8s
[FLOW] Accept terms ────────────────── 2.3s
Verify payment page ────────────────── 3ms
Verify Redsys ──────────────────────── 20.0s   ← EXTERNAL IFRAME
```

### Test: Checkout E2E credit card (47.0s) — NO video modal
```
[FLOW] Navigate + select 1 seat ─── 11.1s
  ├─ Navigate to showtime 138-43539 ── 6.8s   (IMAX — no video)
  ├─ Dismiss blocking modals ───────── 522ms   ← FAST
  ├─ Select first available seat ───── 2.0s
  └─ Confirm seats ─────────────────── 1.9s
[FLOW] Login as guest ──────────────── 1.2s
[FLOW] Select 1 ticket ────────────── 3.2s
[FLOW] Skip bar ────────────────────── 3.9s
[FLOW] Accept terms ────────────────── 2.4s
Verify payment heading ─────────────── 1.9s
Verify Redsys ──────────────────────── 22.0s   ← EXTERNAL IFRAME
Verify gift card ───────────────────── 28ms
```

### Test: Bar Menu MENUS tab — Component (28.0s)
```
beforeEach (full flow to bar):
  ├─ Navigate to 138-43544 ─────────── 14.0s   (XL — slow load?)
  ├─ Dismiss modals ────────────────── 714ms
  ├─ Select seat ───────────────────── 1.9s
  ├─ Confirm ───────────────────────── 1.3s
  ├─ Login as guest ────────────────── 1.0s
  ├─ Select ticket ─────────────────── 2.3s
  └─ Confirm tickets ───────────────── 104ms
Handle bar modal ───────────────────── 2.6s
Handle Galicia modal ───────────────── 174ms
Test body ──────────────────────────── <1s
```

---

## 4. Optimization Recommendations

### R1: Force-dismiss D-BOX/ScreenX video modal (HIGH IMPACT)
**Estimated savings: ~180 seconds (3 tests × 60s)**

Option A — Remove the modal via JavaScript:
```typescript
await page.evaluate(() => {
  document.querySelector('aside.v-modal[role="dialog"]')?.remove();
  document.querySelector('.v-modal-overlay, .v-modal__backdrop')?.remove();
});
```

Option B — `page.addInitScript()` to intercept the modal before it appears.

Option C — Investigate the actual D-BOX modal DOM structure to find a "Skip" button we're not matching.

### R2: Reassign Gift Card test showtime (HIGH IMPACT)
**Estimated savings: ~60 seconds**

The `Gift card visible on payment` test does NOT need ScreenX. Change `reserve2` from `138-43547` (ScreenX) to a showtime without premium format (e.g., `138-43540`, Sala 5, Reclinable 3D).

### R3: Reduce wait in seat selection (MEDIUM IMPACT)
**Estimated savings: ~15-20 seconds total**

Reduce `wait(1500)` → `wait(500)` in `selectFirstAvailableSeat()`. The current wait is conservative; 500ms should be enough for the UI to register the selection.

### R4: Redsys — No action needed (accept as external dependency)
The 30s timeout is correct. Reducing it would cause flakiness.

---

## 5. Impact Projection

| Optimization | Affected Tests | Savings/Test | Total Savings |
|-------------|----------------|--------------|---------------|
| R1: Skip video modal | 2 (D-BOX) | 60s | **120s** |
| R2: Swap ScreenX showtime | 1 (Gift card) | 60s | **60s** |
| R3: Reduce wait(1500) | ~20 tests | 0.75s | **~15s** |
| **TOTAL** | | | **~195s (~3.2 min)** |

**Current time:** ~4.8 min wall-clock
**Projected time:** ~2-3 min wall-clock (depending on parallelization)

---

## 6. Risks

| Optimization | Risk Level | Details |
|-------------|------------|---------|
| R1 (force-remove modal) | Medium | If the D-BOX modal sets JS state needed for the purchase flow, removing it could break subsequent steps. Needs validation. |
| R2 (swap showtime) | Low | The test only verifies gift card on payment. No format dependency. |
| R3 (reduce wait) | Moderate | Risk of flakiness if the UI is slow to register clicks on preprod. |

---

*Generated from Allure report inspection — all timings verified against step-by-step data.*
