# BUG: Preprod Oasiz Cinema API Returns 404/403 — No Films Displayed

**Priority**: High
**Component**: Cinemas - Cinema Detail / Seat Picker
**Environment**: Preprod (`https://preprod-web.ocgtest.es/`)
**Affects Tests**: `seatPicker.spec.ts` — All D-BOX Sofa Seat Selection tests (6 tests)
**Date**: 2025-07-22
**Reporter**: QA Automation Team

---

## Summary

The Oasiz cinema detail page on preprod returns no films. Two backend APIs are failing:

1. **Omnia API** (`/api/omnia/v1/page?friendly=/cines/oasiz/`) returns **HTTP 404**
2. **Vista API** (`/ocapi/v1/films/availability`) returns **HTTP 403 Forbidden**

As a result, the film list container renders but remains empty — no film titles, no showtimes. All 6 D-BOX seat selection tests fail because they cannot proceed past the cinema detail page.

## Steps to Reproduce

1. Navigate to `https://preprod-web.ocgtest.es/`
2. Go to Cinemas section
3. Select Oasiz cinema
4. Observe the cinema detail page

**Expected**: Film list loads with available movies and showtimes (including D-BOX sessions)
**Actual**: Film list container renders empty. No films, no showtimes. Page eventually shows only header banner ("Hey! Ho!") and footer.

## Technical Details

### Failing API Endpoints

#### 1. Omnia API — HTTP 404

```
GET /api/omnia/v1/page?friendly=/cines/oasiz/&components=DateShowtimePicker...
Host: preprod-web.ocgtest.es
Status: 404 Not Found
```

This endpoint should return the cinema page content including the DateShowtimePicker component data.

#### 2. Vista API — HTTP 403

```
GET /ocapi/v1/films/availability
Host: preprod-vwc.ocgtest.es
Status: 403 Forbidden
```

This endpoint should return film availability for the selected cinema.

### Preprod Build Information

```
Build: 2.8.0-prerelease-2ed12f3
Date: 26 mar 2026, 11:00
Frontend Host: preprod-web.ocgtest.es
Backend API Host: preprod-vwc.ocgtest.es
```

### Evidence — Trace Analysis

Trace file loaded in `trace.playwright.dev` for the D-BOX Single Seat test:

1. Page navigates to `https://preprod-web.ocgtest.es/cines/oasiz/`
2. Network tab shows 404 on Omnia API and 403 on Vista API
3. DOM renders `.v-showtime-picker-film-list` container (visible) but with zero children
4. `.v-showtime-picker-film-details .v-film-title__text` never appears
5. Page goes blank — only "Hey! Ho!" banner and footer remain
6. Test times out waiting for film names

### Evidence — Headed Re-execution (2025-07-22)

All 6 D-BOX tests re-executed with `--headed --workers=1` against preprod:

| Status | Duration | Test Name                                                                 |
| ------ | -------- | ------------------------------------------------------------------------- |
| broken | 94.8s    | Seat Picker · D-BOX · Attempt selection · Leave empty gap — Oasiz         |
| broken | 95.8s    | Seat Picker · D-BOX · Select sofa · Single seat — Oasiz                   |
| failed | 67.4s    | Seat Picker · D-BOX · Select sofa · Separate group different rows — Oasiz |
| failed | 69.4s    | Seat Picker · D-BOX · Select sofa · Leave 1 gap — Oasiz                   |
| failed | 89.0s    | Seat Picker · D-BOX · Attempt selection · Separate group same row — Oasiz |
| failed | 89.5s    | Seat Picker · D-BOX · Display · Regular & sofa ticket types — Oasiz       |

**Broken** (2 tests): Hit the 90s test timeout — the page loads but hangs waiting for film data.
**Failed** (4 tests): Hit 60s navigation/locator timeouts — `page.goto` or `locator.waitFor` fails first.

### Error Details

**Broken tests** — Test timeout:

```
Test timeout of 90000ms exceeded.
```

**Failed tests — Variant A** — Locator timeout:

```
TimeoutError: locator.waitFor: Timeout 60000ms exceeded.
Call log:
  - waiting for locator('.v-showtime-picker-film-details .v-film-title__text').first() to be visible
```

**Failed tests — Variant B** — Navigation timeout:

```
TimeoutError: page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "https://preprod-web.ocgtest.es/", waiting until "load"
```

### Affected Test Flow

```
Navbar → Cinemas → Select Oasiz → [Cinema Detail: API 404/403] → ❌ No films → getFilmNames() timeout → Test fails
```

The failure occurs at `cinemaDetail.selectDBoxRandomFilmAndShowtime()` which calls `getFilmNames()`. This method waits for `.v-showtime-picker-film-list` to be visible (it is) and then for `.v-film-title__text` to be visible (it never appears because no films are returned by the API).

### Broader Preprod Impact

From the full 47-test preprod regression run:

| Result  | Count | Percentage |
| ------- | ----- | ---------- |
| Passed  | 16    | 34%        |
| Failed  | 13    | 28%        |
| Broken  | 11    | 23%        |
| Skipped | 7     | 15%        |

9 of the 11 broken tests are D-BOX/seatPicker tests caused by this same API issue. Additional tests in other components (bar, cinemas) that depend on the Oasiz cinema flow are also affected.

## Root Cause Analysis

This is an **environment/infrastructure issue**, not a test defect. The same tests pass consistently on production and lab environments (tagged `@lab-pass`). The preprod APIs are returning error responses:

- **404 on Omnia**: The cinema page configuration for `/cines/oasiz/` may not be deployed or configured in preprod
- **403 on Vista**: The films availability endpoint may require authentication/authorization that is not configured in preprod, or CORS/IP restrictions may be blocking the request

## Impact

- **Blocking**: All D-BOX seat selection tests (6), companion/wheelchair tests (2), and promo tests (1) that go through Oasiz cinema on preprod
- **Tests affected**: 9 tests broken directly, plus 4+ tests failed in dependent booking flows
- **CI/CD impact**: Preprod regression cannot validate seat picker functionality

## Suggested Resolution

1. **Verify Omnia API deployment** — Ensure cinema page data for `/cines/oasiz/` exists in preprod CMS
2. **Check Vista API permissions** — Verify the films availability endpoint is accessible from preprod frontend
3. **Verify API gateway configuration** — Ensure preprod-vwc.ocgtest.es routes are properly configured
4. **Compare with lab/production** — These same APIs work correctly on `lab-web.ocgtest.es` and `www.cinesa.es`

## Workaround (Test Suite)

Tests are already tagged with environment-specific results:

- `@preprod-broken` for the 9 tests that break due to this API issue
- `@preprod-fail` for tests that fail in related flows
- Tests can be filtered with `--grep-invert "@preprod-broken"` to skip known broken tests

---

## JIRA Fields Suggestion

| Field               | Value                                                                 |
| ------------------- | --------------------------------------------------------------------- |
| **Project**         | COMS                                                                  |
| **Issue Type**      | Bug                                                                   |
| **Priority**        | High                                                                  |
| **Labels**          | `preprod-environment`, `api`, `cinema-detail`, `oasiz`, `seat-picker` |
| **Components**      | Cinemas, Seat Picker, API                                             |
| **Environment**     | Preprod                                                               |
| **Affects Version** | 2.8.0-prerelease-2ed12f3                                              |
| **Sprint**          | Current                                                               |
| **Linked Tests**    | COMS-4853 (D-BOX seat selection)                                      |
