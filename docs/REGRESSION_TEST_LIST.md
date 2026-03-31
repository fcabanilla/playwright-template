# Regression Test List — Cinesa Lab

**Status**: Active  
**Last updated**: 2026-03-26  
**Total tests**: 63  
**Branch**: `chore/reporter-results-stabilization`

## Execution Strategy (ADR-0018)

Two-phase regression to avoid showtime race conditions:

| Phase       | Scope                   | Workers | Tests | Tag filter                  |
| ----------- | ----------------------- | ------- | ----- | --------------------------- |
| **Phase 1** | Non-checkout (parallel) | 3       | 57    | `--grep-invert '@checkout'` |
| **Phase 2** | Checkout (serial)       | 1       | 6     | `--grep '@checkout'`        |

Both phases write to the same `.allure/results/` directory.

### Commands

```bash
# 1. Clean old results (MANDATORY)
npm run report:clean:results

# 2. Phase 1: Non-checkout (3 workers, headless) — uses @lab-pass/@lab-fail tags
TEST_ENV=lab npx playwright test \
  --project='Cinesa' --workers=3 --no-deps \
  --grep '@lab-(pass|fail)' --grep-invert '@checkout'

# 3. Phase 2: Checkout (1 worker, headless) — uses @lab-pass/@lab-fail + @checkout tags
TEST_ENV=lab npx playwright test \
  --project='Cinesa' --workers=1 --no-deps \
  --grep '@lab-(pass|fail).*@checkout|@checkout.*@lab-(pass|fail)'

# 4. Generate report
npm run report
```

---

## Phase 1 — Non-Checkout Tests (57 tests, 3 workers)

### analytics (1 test)

| #   | Test Name                                                 | File:Line              |
| --- | --------------------------------------------------------- | ---------------------- |
| 1   | GA4 · Data Layer · Validate events · Classic menu — Oasiz | `analytics.spec.ts:36` |

### bar (2 tests)

| #   | Test Name                                                | File:Line        |
| --- | -------------------------------------------------------- | ---------------- |
| 2   | F&B · Classic Menu · Purchase · Single ticket — Oasiz    | `bar.spec.ts:22` |
| 3   | F&B · Classic Menu · Purchase · Multiple tickets — Oasiz | `bar.spec.ts:70` |

### blog (3 tests)

| #   | Test Name                                              | File:Line                |
| --- | ------------------------------------------------------ | ------------------------ |
| 4   | Blog · Landing · Display · Article cards               | `blogLanding.spec.ts:18` |
| 5   | Blog · Landing · Display · All article cards visible   | `blogLanding.spec.ts:29` |
| 6   | Blog · Landing · Navigate · Related articles roundtrip | `blogLanding.spec.ts:38` |

### cinemas (3 tests)

| #   | Test Name                            | File:Line            |
| --- | ------------------------------------ | -------------------- |
| 7   | Cinemas · Page · Display & Layout    | `cinemas.spec.ts:21` |
| 8   | Cinemas · Page · Navigate · Redirect | `cinemas.spec.ts:33` |
| 9   | Cinemas · Schema · Validate · Oasiz  | `cinemas.spec.ts:46` |

### coupons (3 tests)

| #   | Test Name                                         | File:Line            |
| --- | ------------------------------------------------- | -------------------- |
| 10  | Coupons · Page · Display & Layout                 | `coupons.spec.ts:23` |
| 11  | Coupons · Navigation · Redirect · New tab         | `coupons.spec.ts:35` |
| 12  | Coupons · Navigation · Validate · Open in new tab | `coupons.spec.ts:58` |

### experiences (2 tests)

| #   | Test Name                             | File:Line                |
| --- | ------------------------------------- | ------------------------ |
| 13  | Experiences · Page · Display & Layout | `experiences.spec.ts:15` |
| 14  | Experiences · Navigation · Redirect   | `experiences.spec.ts:29` |

### login (2 tests)

| #   | Test Name                                | File:Line          |
| --- | ---------------------------------------- | ------------------ |
| 15  | Login · Auth · Login · Valid credentials | `login.spec.ts:13` |
| 16  | Login · Form · Display · Structure       | `login.spec.ts:24` |

### movies (9 tests)

| #   | Test Name                                              | File:Line            |
| --- | ------------------------------------------------------ | -------------------- |
| 17  | Films · Catalog · Display & Layout                     | `movies.spec.ts:27`  |
| 18  | Films · Catalog · Navigate · Redirect                  | `movies.spec.ts:42`  |
| 19  | Films · Navigation · Browse · Top Movies               | `movies.spec.ts:53`  |
| 20  | Films · Navigation · Browse · Random from All Movies   | `movies.spec.ts:64`  |
| 21  | Films · Navigation · Browse · Random from Now Showing  | `movies.spec.ts:74`  |
| 22  | Films · Navigation · Browse · Random from Coming Soon  | `movies.spec.ts:84`  |
| 23  | Films · Navigation · Browse · Random from Advance Sale | `movies.spec.ts:94`  |
| 24  | Films · Schema · Validate · Oasiz                      | `movies.spec.ts:106` |
| 25  | Films · Schema · Validate URLs · Bug detection         | `movies.spec.ts:129` |

### navbar (3 tests)

| #   | Test Name                                                              | File:Line           |
| --- | ---------------------------------------------------------------------- | ------------------- |
| 26  | Navbar · Visibility · Display · All elements                           | `navbar.spec.ts:19` |
| 27  | Navbar · Navigation · Click logo · Stay on home                        | `navbar.spec.ts:37` |
| 28  | Navbar · Navigation · Click each element · Navigate accordingly — DEMO | `navbar.spec.ts:55` |

### programs (4 tests)

| #   | Test Name                                           | File:Line             |
| --- | --------------------------------------------------- | --------------------- |
| 29  | Programs · Unlimited · Display & Layout · From URL  | `programs.spec.ts:21` |
| 30  | Programs · Unlimited · Display & Layout · From Home | `programs.spec.ts:42` |
| 31  | Programs · Page · Display & Layout                  | `programs.spec.ts:61` |
| 32  | Programs · Page · Navigate · Redirect               | `programs.spec.ts:77` |

### promotions (2 tests)

| #   | Test Name                               | File:Line               |
| --- | --------------------------------------- | ----------------------- |
| 33  | Promotions · Page · Display & Layout    | `promotions.spec.ts:15` |
| 34  | Promotions · Page · Navigate · Redirect | `promotions.spec.ts:30` |

### seatPicker (18 tests)

| #   | Test Name                                                                           | File:Line                |
| --- | ----------------------------------------------------------------------------------- | ------------------------ |
| 35  | Seat Picker · Complete Purchase · Purchase · Single seat — Oasiz                    | `seatPicker.spec.ts:38`  |
| 36  | Seat Picker · Complete Purchase · Purchase · Multiple seats — Oasiz                 | `seatPicker.spec.ts:82`  |
| 37  | Seat Picker · Seat Selection · Attempt selection · Leave empty gap — Oasiz          | `seatPicker.spec.ts:133` |
| 38  | Seat Picker · Seat Selection · Attempt selection · Separate group same row — Oasiz  | `seatPicker.spec.ts:158` |
| 39  | Seat Picker · Seat Selection · Select seats · Separate group different rows — Oasiz | `seatPicker.spec.ts:184` |
| 40  | Seat Picker · Seat Selection · Validate · No seats selected — Oasiz                 | `seatPicker.spec.ts:210` |
| 41  | Seat Picker · Seat Selection · Select seats · Over capacity — Oasiz                 | `seatPicker.spec.ts:233` |
| 42  | Seat Picker · Accessibility · Select seats · Companion only — Oasiz                 | `seatPicker.spec.ts:266` |
| 43  | Seat Picker · Accessibility · Select seats · Companion + Wheelchair — Oasiz         | `seatPicker.spec.ts:291` |
| 44  | Seat Picker · Accessibility · Select seats · Wheelchair only — Oasiz                | `seatPicker.spec.ts:318` |
| 45  | Seat Picker · D-BOX · Select sofa · Single seat — Oasiz                             | `seatPicker.spec.ts:350` |
| 46  | Seat Picker · D-BOX · Select sofa · Leave 1 gap — Oasiz                             | `seatPicker.spec.ts:369` |
| 47  | Seat Picker · D-BOX · Attempt selection · Leave empty gap — Oasiz                   | `seatPicker.spec.ts:395` |
| 48  | Seat Picker · D-BOX · Attempt selection · Separate group same row — Oasiz           | `seatPicker.spec.ts:422` |
| 49  | Seat Picker · D-BOX · Select sofa · Separate group different rows — Oasiz           | `seatPicker.spec.ts:448` |
| 50  | Seat Picker · D-BOX · Display · Regular & sofa ticket types — Oasiz                 | `seatPicker.spec.ts:467` |
| 51  | Seat Picker · Promotional Codes · Purchase · Standard — Oasiz                       | `seatPicker.spec.ts:522` |
| 52  | Seat Picker · Promotional Codes · Purchase · La Vanguardia — Oasiz                  | `seatPicker.spec.ts:562` |

### signup (5 tests)

| #   | Test Name                                                  | File:Line           |
| --- | ---------------------------------------------------------- | ------------------- |
| 53  | Signup · Form · Display & Layout                           | `signup.spec.ts:16` |
| 54  | Signup · Form · Validate · Mandatory fields                | `signup.spec.ts:30` |
| 55  | Signup · Form · Validate · Email field                     | `signup.spec.ts:46` |
| 56  | Signup · Form · Validate · Password field                  | `signup.spec.ts:61` |
| 57  | Signup · Registration · Signup · Valid data + unique email | `signup.spec.ts:76` |

---

## Phase 2 — Checkout Tests (6 tests, 1 worker)

### checkout.e2e (2 tests)

| #   | Test Name                                           | File:Line                 |
| --- | --------------------------------------------------- | ------------------------- |
| 58  | Checkout · E2E · Single Seat · Gift Card — Oasiz    | `checkout.e2e.spec.ts:26` |
| 59  | Checkout · E2E · Multiple Seats · Gift Card — Oasiz | `checkout.e2e.spec.ts:70` |

### checkout.giftcard (2 tests)

| #   | Test Name                                                                                | File:Line                      |
| --- | ---------------------------------------------------------------------------------------- | ------------------------------ |
| 60  | Checkout · Gift Card · Full Purchase with Post-Payment Verification — Oasiz              | `checkout.giftcard.spec.ts:22` |
| 61  | Checkout · Gift Card · Nine Seats · Full Purchase with Post-Payment Verification — Oasiz | `checkout.giftcard.spec.ts:96` |

### checkout.smoke (2 tests)

| #   | Test Name                                               | File:Line                   |
| --- | ------------------------------------------------------- | --------------------------- |
| 62  | Checkout · Smoke · Single Seat · Credit Card — Oasiz    | `checkout.smoke.spec.ts:20` |
| 63  | Checkout · Smoke · Multiple Seats · Credit Card — Oasiz | `checkout.smoke.spec.ts:97` |

---

## Excluded from Regression

The following spec files exist in the project but are **NOT part of this regression**:

| Directory                       | Reason                                                  |
| ------------------------------- | ------------------------------------------------------- |
| `tests/cinesa/footer/*`         | 28 footer tests — covered by separate footer regression |
| `tests/cinesa/infrastructure/*` | Infrastructure diagnostic test — not user-facing        |

---

## Notes

- **Environment**: `TEST_ENV=lab` (`https://lab-web.ocgtest.es/`)
- **Config**: `headless: true` in `playwright.config.ts` for automated regression
- **Allure**: Clean results before each run (`npm run report:clean:results`)
- **Rate limiting**: Gift Card API (`OCAPI.Payments.AddGiftCardPayment`) may return 429 if too many gift card tests run in sequence. Known environment limitation, not a code bug.
- **Cloudflare**: Lab environment has Cloudflare protection. If tests fail with Cloudflare challenges, use `--headed --workers=1`.
