# ADR-0018: Checkout Showtime Isolation Strategy

**Status**: Accepted (Phase 2 Implemented)

**Date**: 2026-03-25

**Updated**: 2026-06-13

**Authors**: [@fcabanilla]

**Reviewers**: []

## Context

Checkout tests (`@checkout`) perform real seat selections and purchase flows against a shared cinema showtime. When Playwright runs multiple checkout workers in parallel, they all enter the same showtime (e.g., Lightyear at Oasiz, 21:55), select seats, and race to confirm. The first worker to confirm succeeds; the server revokes remaining workers' selections, causing 4/6 checkout tests to fail with "No se ha seleccionado ninguna butaca" (no seat selected).

### Background

- Trace analysis confirmed the race: Worker selects seat [Row 4, Seat 7] → footer shows "Butacas seleccionadas: 4-7" → Continuar enabled → another worker confirms first → server revokes → seat becomes "Unavailable" → Continuar disabled → timeout on `clickContinueAsGuest`
- `cinemaDetail.page.ts` shuffles film names randomly but all workers converge on the same showtime because the available showtimes are limited in lab/preprod environments
- All 6 checkout tests are tagged `@checkout` across 3 spec files: `checkout.smoke.spec.ts`, `checkout.e2e.spec.ts`, `checkout.giftcard.spec.ts`

### Forces at Play

- Checkout tests MUST NOT run in parallel against the same showtime — server enforces single-confirmation per seat
- Non-checkout tests (navbar, footer, movies, blog, etc.) are read-only and benefit from parallelism
- Global `--workers=1` would make the full regression suite unacceptably slow
- Lab/preprod environments have limited showtimes, increasing collision probability
- Future scaling to 500+ tests requires a sustainable isolation strategy

## Decision

### Chosen Option

**Two-Phase Regression Script (Immediate) + Showtime Claim Pool (Future)**

#### Phase 1 — Immediate Workaround (Implemented)

Run regression in two sequential phases via npm scripts:

```bash
# Phase 1: All non-checkout tests in parallel (default workers)
npx playwright test --project='Cinesa' --grep-invert '@checkout'

# Phase 2: Checkout tests serialized (workers=1)
npx playwright test --project='Cinesa' --grep '@checkout' --workers=1
```

Both phases write to the same `.allure/results/` directory, so the final Allure report includes all tests.

**New npm scripts:**

```json
"test:es:regression": "npx playwright test --project='Cinesa' --grep-invert '@checkout' && npx playwright test --project='Cinesa' --grep '@checkout' --workers=1",
"test:es:regression:lab": "cross-env TEST_ENV=lab npm run test:es:regression",
"test:es:regression:preprod": "cross-env TEST_ENV=preprod npm run test:es:regression"
```

#### Phase 2 — Showtime Claim Pool (Implemented)

Replaced `--workers=1` and random showtime selection with deterministic room-per-worker routing using `test.info().parallelIndex`:

```typescript
// config/showtimes.pool.ts
const ROOM_POOLS: string[][] = [
  ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 4'], // Worker 0
  ['Sala 5', 'Sala 6', 'Sala 7', 'Sala 8'], // Worker 1
  ['Sala 9', 'Sala 10', 'Sala 11', 'Sala 12'], // Worker 2
];

export function getShowtimeSelectionForWorker(
  workerIndex: number,
  format: 'normal' | 'dbox' | 'any' = 'normal'
): WorkerShowtimeConfig {
  const poolIndex = workerIndex % ROOM_POOLS.length;
  return {
    requiredFormat: format,
    preferredRooms: ROOM_POOLS[poolIndex],
    workerIndex,
  };
}
```

**How it works:**

- Each worker gets an exclusive subset of 4 rooms (out of 12 standard rooms at Oasiz)
- `selectFilmAndShowtimeByFormatAndRoom(criteria)` filters showtimes to only the worker's assigned rooms
- No lockfile, no shared state, no IPC needed
- Workers run in full parallel (3 workers) without seat conflicts
- Supports up to 3 isolated workers; wraps with modular arithmetic if more are used

**Files updated:**

- `config/showtimes.pool.ts` — New file with pool configuration and `getShowtimeSelectionForWorker()`
- `tests/cinesa/seatPicker/seatPicker.spec.ts` — 12 normal showtime calls replaced with pool
- `tests/cinesa/bar/bar.spec.ts` — 2 calls replaced with pool
- `tests/cinesa/analytics/analytics.spec.ts` — 1 call replaced with pool
- `tests/cinesa/checkout/checkout.smoke.spec.ts` — 2 calls replaced with pool
- `tests/cinesa/checkout/checkout.e2e.spec.ts` — 2 calls replaced with pool
- `tests/cinesa/checkout/checkout.giftcard.spec.ts` — 2 calls replaced with pool

**D-BOX tests** remain using `selectDBoxRandomFilmAndShowtime()` because D-BOX rooms are separate from the standard Sala 1-12 pool and cannot be partitioned (typically only 1 D-BOX room per cinema).

### Considered Alternatives

#### Option A: Global `--workers=1`

- **Pros**: Simple, guaranteed no conflicts
- **Cons**: Full regression suite becomes 3-4x slower, penalizes read-only tests that don't need serialization
- **Reason for rejection**: Unacceptable performance impact for 64+ test suite

#### Option B: `test.describe.configure({ mode: 'serial' })`

- **Pros**: Native Playwright API, per-describe serialization
- **Cons**: Only serializes within the same file — does not prevent cross-file conflicts. Checkout tests span 3 files.
- **Reason for rejection**: Does not solve the actual problem (cross-file worker collision)

#### Option C: File-based lock with `flock`/`lockfile`

- **Pros**: True mutex across workers
- **Cons**: Complex, error-prone cleanup on test crashes, not cross-platform, race condition on lock acquisition itself
- **Reason for rejection**: Over-engineered for a problem solvable with deterministic routing

## Consequences

### Positive

- Non-checkout tests retain full parallelism (default workers)
- Checkout tests guaranteed to pass without seat conflicts
- Allure results accumulate correctly across both phases
- Future showtime pool enables full parallelism for ALL tests
- `parallelIndex` approach is simple, deterministic, and requires no shared state

### Negative

- Two-phase script adds ~30s overhead per regression run (Playwright startup cost)
- Showtime pool requires maintaining a list of valid showtimes per environment
- Showtime pool must be updated if lab/preprod showtime data changes

### Neutral

- `@checkout` tag becomes a load-bearing convention — all checkout tests MUST use it
- Future showtime pool can be extended to UCI platform with same pattern

## Implementation

### Phase 1 — Immediate (Sprint current)

1. Add `test:es:regression`, `test:es:regression:lab`, `test:es:regression:preprod` scripts to `package.json`
2. Validate checkout tests pass with `--workers=1`
3. Update CI pipeline to use `test:es:regression:lab` instead of `test:es:lab`

### Phase 2 — Implemented

1. ~~Create `config/showtimes.pool.ts` with environment-specific showtime pools~~ ✅
2. ~~Modify `cinemaDetail.page.ts` to accept showtime config from pool instead of random selection~~ ✅ (already supported `selectFilmAndShowtimeByFormatAndRoom`)
3. ~~Update checkout specs to call `getShowtimeForWorker()`~~ ✅ (all 21 booking tests updated)
4. Remove `--workers=1` constraint from regression scripts (can now run with default workers)
5. ~~Add pool validation test that verifies all pool entries are valid showtimes~~ (not needed — rooms are static at Oasiz)

### Success Criteria

- Phase 1: All 6 checkout tests pass consistently with `test:es:regression:lab` ✅
- Phase 2: All booking tests (21 normal + 6 checkout) pass with default workers (3) using room pool

### Rollback Plan

- Phase 1: Revert npm scripts to single-phase execution
- Phase 2: Re-add `--workers=1` to checkout phase if pool approach fails

## Notes

- Trace evidence: `.allure/playwright-artifacts/` contains trace.zip files showing the race condition
- `test.info().parallelIndex` documentation: https://playwright.dev/docs/api/class-testinfo#test-info-parallel-index
- Related: ADR-0014 (Cookie Consent Persistence) — storage state files also use per-environment naming
