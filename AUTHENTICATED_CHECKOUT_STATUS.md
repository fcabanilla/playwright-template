# Authenticated Checkout — Implementation Status

> **Date:** 2026-04-15 · **Branch:** `project/praetor` · **Status:** WIP — pending validation

## Objective

Add E2E checkout tests that **login as an authenticated user** (Cinesa Unlimited member) instead of guest checkout, validating:

1. Full checkout flow completes to payment with authenticated session
2. User data is pre-filled in the purchase summary after login

## What Was Built

### New Files

| File | Purpose |
|------|---------|
| `tests/setup/auth-login.setup.ts` | Playwright setup that logs in via home page modal → saves storageState |
| `fixtures/praetor/cinesa/playwright.authenticated.fixtures.ts` | Authenticated fixtures using storageState override |
| `tests/praetor/cinesa/checkout/authenticatedCheckout/authenticatedCheckout.spec.ts` | 2 E2E tests (full flow + summary validation) |
| `tests/praetor/cinesa/checkout/authenticatedCheckout/authenticatedCheckout.data.ts` | Showtimes + URLs for authenticated tests |
| `tests/praetor/cinesa/checkout/authenticatedCheckout/authenticatedCheckout.assertions.ts` | Assertions with Allure steps |
| `scripts/extract-storage-state.cjs` | Utility to parse MCP browser session into storageState JSON |

### Modified Files

| File | Change |
|------|--------|
| `playwright.config.ts` | Added `auth-login-setup` project with dependency on `setup` |
| `core/testBuilder/checkoutFlow.ts` | Extended `LoginStrategy` to `'guest' \| 'skip' \| 'login'` with credential support |
| `config/projects/storageState.helper.ts` | Added `getAuthenticatedStorageStatePath()` helper |
| `fixtures/shared/contextFactory.ts` | `createCinesaContext()` accepts optional `storageStatePath` override |
| `pageObjectsManagers/praetor/cinesa/checkout/seatPicker/seatPicker.page.ts` | Minor fix for seat confirmation validation |
| `core/services/showtimeDiscovery.ts` | Minor showtime discovery improvement |

## Current Blocker: reCAPTCHA + Token Expiry

### What works

- **Seat selection** ✅ — Works correctly with standard fixtures
- **Login via home modal** ✅ — `auth-login.setup.ts` passes in headless (11.6s, no CAPTCHA)
- **StorageState generation** ✅ — Session saved correctly
- **LoginStrategy extension** ✅ — `checkoutFlow.ts` supports guest/skip/login

### What doesn't work

- **Direct login at checkout** ❌ — `/compra/inicio-de-sesion/` has reCAPTCHA that blocks automated login
- **Stale storageState** ❌ — Vista `vd-memhash` token expires in ~30 minutes; tests run with expired session see an empty page

### Never tested (most promising path)

- **Fresh storageState via chained setup** — Run `auth-login.setup.ts` as a project dependency so the session is seconds old when the test uses it. The checkout should recognize the fresh session and auto-skip the "Registro" step (`loginStrategy: 'skip'`).

## Next Steps

1. **Wire `auth-login-setup` as dependency** of a dedicated project so storageState is always fresh
2. **Run tests immediately after setup** to validate that fresh `vd-memhash` auto-skips checkout login
3. If that works: clean up, remove `loginStrategy: 'login'` fallback, finalize assertions
4. If token still expires: investigate if checkout requires a different auth mechanism than the home page session

## Test Credentials

- **Account:** `fcabanilla+unlimited+preprod@cinesa.com` (Cinesa Unlimited member)
- **Environment:** preprod (`TEST_ENV=preprod`)
- **Cinema:** Oasiz (preprod)

## How to Run

```bash
# 1. Generate consent + authenticated states
TEST_ENV=preprod npx playwright test --project=setup
TEST_ENV=preprod npx playwright test --project=auth-login-setup

# 2. Run authenticated checkout tests (immediately after step 1)
TEST_ENV=preprod npx playwright test tests/praetor/cinesa/checkout/authenticatedCheckout/ --project=Praetor-Cinesa --workers=1
```
