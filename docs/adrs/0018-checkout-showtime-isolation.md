# ADR-0018: Checkout Showtime Isolation Strategy

**Status**: Proposed

**Date**: 2026-03-25

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

#### Phase 2 — Future: Showtime Claim Pool

Replace `--workers=1` with deterministic showtime-per-worker routing using `test.info().parallelIndex`:

```typescript
// config/showtimes.pool.ts (FUTURE — not yet implemented)
const SHOWTIME_POOL = [
  { cinema: 'Oasiz', film: 'Lightyear', time: '21:55', room: 'Sala 1' },
  { cinema: 'Oasiz', film: 'Lightyear', time: '19:30', room: 'Sala 3' },
  { cinema: 'Oasiz', film: 'Top Gun', time: '20:00', room: 'Sala 5' },
  // ... more showtimes
];

export function getShowtimeForWorker(): ShowtimeConfig {
  const index = test.info().parallelIndex;
  return SHOWTIME_POOL[index % SHOWTIME_POOL.length];
}
```

**How it works:**

- `test.info().parallelIndex` is unique per Playwright worker (0, 1, 2, ...) and deterministic
- Each worker gets a distinct showtime from the pool via modular arithmetic
- No lockfile, no shared state, no IPC needed
- Workers can run in full parallel without seat conflicts
- Pool must have at least as many entries as `--workers` count

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

### Phase 2 — Future (Backlog)

1. Create `config/showtimes.pool.ts` with environment-specific showtime pools
2. Modify `cinemaDetail.page.ts` to accept showtime config from pool instead of random selection
3. Update checkout specs to call `getShowtimeForWorker()`
4. Remove `--workers=1` constraint from regression scripts
5. Add pool validation test that verifies all pool entries are valid showtimes

### Success Criteria

- Phase 1: All 6 checkout tests pass consistently with `test:es:regression:lab`
- Phase 2: All 6 checkout tests pass with default workers (≥3) using showtime pool

### Rollback Plan

- Phase 1: Revert npm scripts to single-phase execution
- Phase 2: Re-add `--workers=1` to checkout phase if pool approach fails

## Notes

- Trace evidence: `.allure/playwright-artifacts/` contains trace.zip files showing the race condition
- `test.info().parallelIndex` documentation: https://playwright.dev/docs/api/class-testinfo#test-info-parallel-index
- Related: ADR-0014 (Cookie Consent Persistence) — storage state files also use per-environment naming
