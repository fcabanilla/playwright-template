# Session Learnings — July 2025

> Findings, patterns, and recommendations from the systematic review and fix of 9+ failing Playwright E2E tests.

---

## Table of Contents

- [Summary of Fixes](#summary-of-fixes)
- [Root Cause Patterns](#root-cause-patterns)
- [Anti-Patterns Found](#anti-patterns-found)
- [Recommendations](#recommendations)
- [Architecture Observations](#architecture-observations)
- [Environment-Specific Issues](#environment-specific-issues)

---

## Summary of Fixes

| # | Test | Root Cause | Fix | Status |
|---|------|-----------|-----|--------|
| 1 | Movies · Random Browse | `page.goBack()` defaults to `waitUntil: "load"` — never fires in SPA | Made `webActions.goBack()` configurable, default `'domcontentloaded'`, movies uses `'commit'` | ✅ 12/12 passed |
| 2 | Movies · Stale DOM | Single DOM snapshot + positional indices → stale after SPA re-render | Lazy selection pattern — `Set<string>` of visited titles, fresh DOM query each iteration | ✅ 12/12 passed |
| 3 | Promotions · Display Layout | `waitForLoadState('networkidle')` — analytics never idle in SPA | `'networkidle'` → `'domcontentloaded'` | ✅ 2/2 passed |
| 4 | Bar · New Tab Popup | `waitForLoadState('networkidle')` in popup context | `'networkidle'` → `'domcontentloaded'` + extracted inline selector to `BAR_SELECTORS` | ✅ (networkidle fix; booking flow still times out) |
| 5 | D-BOX Display Tickets | Regex `D-BOX$` doesn't match UI text `DBOX` (no hyphen) | Regex `D-?BOX`, added MyCinesa/Adulto/Infantil patterns | ✅ 1/1 passed |
| 6 | SeatPicker · Over Capacity | Hardcoded `maxSeatSelection=9` wrong for IMAX (25+); `waitForResponse` on already-consumed response | Dynamic FIFO detection via `aria-pressed` polling + force `format: 'normal'` | ✅ Code improved (preprod backend doesn't enforce limits) |

### Tests Not Fixable via Code

| Test | Issue | Tag |
|------|-------|-----|
| Checkout · Gift Card | No films available / gift card validation endpoint | `@lab-fail`, `@preprod-broken` |
| Checkout · Single Seat | Redsys 3DS payment timeout | `@lab-fail`, `@preprod-fail` |
| Checkout · Multiple Seats | Redsys 3DS payment timeout | `@lab-fail`, `@preprod-fail` |
| Analytics · GA4 Data Layer | GA4 data layer events not firing | `@lab-fail`, `@preprod-broken`, `@broken-prod` |

---

## Root Cause Patterns

### 1. SPA-Incompatible Wait Strategies (3 tests)

**Pattern:** Using Playwright's `networkidle` or `load` wait states in a Single Page Application.

**Why it fails:** SPAs continuously fire analytics requests (Google Analytics, Hotjar, etc.), which means `networkidle` (500ms with no network activity) never resolves. Similarly, `"load"` event may not fire after SPA navigations.

**Affected locations found:**
- `promotions.spec.ts` — `waitForLoadState('networkidle')` ← Fixed
- `bar.page.ts` — `waitForLoadState('networkidle')` in popup ← Fixed
- `webActions.goBack()` — hardcoded `waitUntil: 'load'` ← Fixed
- 20+ instances in footer/navbar tests — `page.waitForLoadState('networkidle')` ← Future cleanup

**Fix:** Always use `'domcontentloaded'` for SPAs. For `goBack()`, use `'commit'` when the SPA re-renders fast.

### 2. Hardcoded Assumptions (2 tests)

**Pattern:** Hardcoding values that vary by context (room type, ticket names).

**Examples:**
- `maxSeatSelection = 9` — correct for standard rooms, wrong for IMAX (25+)
- Regex `D-BOX$` — strict hyphen match, but UI sometimes renders `DBOX`

**Fix:** Use dynamic detection (query actual UI state) or flexible patterns.

### 3. Stale DOM References (1 test)

**Pattern:** Taking a single DOM snapshot and iterating with positional indices after SPA navigation.

**Why it fails:** After `goBack()`, the SPA re-renders and previous element references (`locator` objects with nth-child positions) may point to different or non-existent elements.

**Fix:** Lazy selection — query DOM fresh each iteration, track visited items by content (title text) instead of position.

---

## Anti-Patterns Found

### ❌ `waitForLoadState('networkidle')` in SPA

```typescript
// ❌ Never use in SPA — analytics keep network busy
await page.waitForLoadState('networkidle');

// ✅ Use domcontentloaded instead
await page.waitForLoadState('domcontentloaded');
```

**Scope:** Found 20+ instances across the codebase. High-priority cleanup recommended.

### ❌ `waitForResponse` on Already-Consumed Responses

```typescript
// ❌ If the response already happened during navigation, this hangs forever
const response = await page.waitForResponse('/seat-availability');

// ✅ Use Promise.all to capture response during the action that triggers it
const [response] = await Promise.all([
  page.waitForResponse('/seat-availability'),
  page.click(triggerButton),
]);
```

### ❌ Single DOM Snapshot for Multi-Page Iteration

```typescript
// ❌ Elements go stale after goBack()
const movies = await page.$$('.movie-card');
for (const movie of movies) {
  await movie.click(); // may fail on 2nd iteration
  await page.goBack();
}

// ✅ Fresh query each iteration, track by content
const visited = new Set<string>();
while (true) {
  const cards = page.locator('.movie-card');
  // find first unvisited card by title text...
}
```

### ❌ Hardcoded Max Values That Vary by Room Type

```typescript
// ❌ IMAX allows 25+, standard allows 9
const maxSeats = 9;

// ✅ Dynamic detection via FIFO behavior
for (const seat of available) {
  await selectSeat(seat);
  if (await firstSeat.getAttribute('aria-pressed') !== 'true') {
    detectedMax = selectedSeats.length - 1;
    break;
  }
}
```

---

## Recommendations

### High Priority

1. **Systematic `networkidle` cleanup** — 20+ remaining instances in footer/navbar page objects. Each is a potential timeout bomb. Consider a lint rule or grep-based CI check:
   ```bash
   # CI check: fail if networkidle is used outside allowed files
   grep -r "networkidle" --include="*.ts" | grep -v "node_modules" | grep -v ".md"
   ```

2. **Add `'domcontentloaded'` as default for `waitForLoadState`** — Consider wrapping all `waitForLoadState` calls in WebActions with a safe default. The Playwright default is `'load'`, which is also problematic in SPAs.

3. **Environment-aware test skipping** — Tests tagged `@preprod-broken` still run and fail on preprod. Consider adding:
   ```typescript
   test.skip(process.env.TEST_ENV === 'preprod', 'Known preprod limitation');
   ```
   This would reduce noise in CI results.

### Medium Priority

4. **IMAX vs Standard room taxonomy** — The showtime pool (`config/showtimes.pool.ts`) doesn't currently distinguish between IMAX and standard rooms. The `format: 'normal'` filter was added as a workaround, but a proper room type classification would help:
   - Standard: max 9 seats
   - IMAX: max 25+ seats
   - D-BOX: special seat layout
   
5. **Ticket name normalization** — The ticket type names vary unpredictably (`D-BOX` vs `DBOX`, `Precio MyCinesa` vs `Adulto`). Consider maintaining a canonical mapping in `ticketPicker.data.ts` that normalizes all known variants.

6. **`WebActions.goBack()` documentation** — The new configurable `waitUntil` parameter should be documented in the WebActions ADR, with SPA-specific guidance.

### Low Priority

7. **Booking flow timeout** — Bar tests use a 90s test timeout for the complete booking flow but consistently time out. The booking flow on preprod takes 2+ minutes. Consider either:
   - Increasing timeout to 180s for full booking tests
   - Breaking the flow into smaller, independent test steps

8. **Checkout test data dependency** — All 3 checkout tests fail because film/showtime availability varies. Consider using a "known available" showtime endpoint or API check before starting the booking flow.

---

## Architecture Observations

### Strengths

- **WebActions abstraction** is powerful — wrapping `goBack()` with configurable options was trivial because all Playwright access goes through one layer
- **Selector separation** prevented coupling — fixing `bar.page.ts` inline selector was easy because the pattern violation was visually obvious
- **Fixture DI** allowed quick test isolation — modifying `format: 'normal'` only affected one test without touching shared setup
- **Allure step reporting** made debugging efficient — the `[NAV]`/`[ACT]`/`[WAIT]` taxonomy showed exactly where each test failed

### Areas for Improvement

- **`waitForLoadState` calls bypass WebActions** — Tests and page objects call `page.waitForLoadState()` directly instead of through WebActions. This violates the architecture rule and makes it hard to enforce safe defaults globally.
- **Missing room metadata** — The seat picker doesn't know what type of room it's in (standard vs IMAX vs D-BOX). This information is visible in the UI header but isn't captured as test context.
- **No contract tests for ticket names** — Ticket type names come from the backend and change without notice (`DBOX` vs `D-BOX`). A lightweight API contract test or snapshot test would catch these early.

---

## Environment-Specific Issues

### Preprod (`preprod-web.ocgtest.es`)

| Issue | Impact | Evidence |
|-------|--------|----------|
| No max seat limit enforcement | Over Capacity test can't detect FIFO deselection | 25 seats selected without any being deselected |
| Film availability gaps | Checkout tests can't find showtimes | "No films available" errors |
| Cloudflare bypass required | All tests need CF headers/cookies | Auto-injected via `cloudflareBypass.ts` |

### Lab (`lab-web.ocgtest.es`)

| Issue | Impact | Evidence |
|-------|--------|----------|
| Seat limits enforced | Over Capacity works correctly | `@lab-pass` tag confirmed |
| Payment provider timeouts | Checkout tests fail at Redsys 3DS | `@lab-fail` on all checkout tests |

### Production (`www.cinesa.es`)

| Issue | Impact | Evidence |
|-------|--------|----------|
| Cloudflare challenge blocks headless | Can't run automated tests without CF bypass | Turnstile challenge page shown |
| Full functionality available | All features work when accessed manually | Production is the reference environment |

---

## Files Modified This Session

| File | Changes |
|------|---------|
| `core/webactions/webActions.ts` | `goBack()` configurable `waitUntil`, `scrollIntoView()` with timeout + targetName |
| `pageObjectsManagers/cinesa/movies/movies.page.ts` | Lazy selection pattern in 3 methods |
| `pageObjectsManagers/cinesa/seatPicker/seatPicker.page.ts` | `selectMoreThanMaxSeats()` dynamic FIFO detection |
| `pageObjectsManagers/cinesa/bar/bar.page.ts` | `networkidle` → `domcontentloaded`, inline selector → `BAR_SELECTORS` |
| `tests/cinesa/promotions/promotions.spec.ts` | `networkidle` → `domcontentloaded` |
| `tests/cinesa/seatPicker/seatPicker.spec.ts` | `format: 'normal'` for Over Capacity test |
| `tests/cinesa/seatPicker/seatPicker.assertions.ts` | Dynamic assertion counts, D-BOX regex, MyCinesa patterns |
| `tests/cinesa/ticketPicker/ticketPicker.data.ts` | MyCinesa DBOX/Sofa mappings, Adulto/Infantil entries |

---

*Created: July 2025*
*Context: Systematic test failure analysis on preprod environment*
