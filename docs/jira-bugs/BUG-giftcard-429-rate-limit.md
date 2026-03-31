# BUG: Gift Card Payment API Returns HTTP 429 (Rate Limit)

**Priority**: High
**Component**: Checkout - Gift Card Payment
**Environment**: Lab (`https://lab-web.ocgtest.es/`)
**Affects Tests**: `checkout.giftcard.spec.ts` — Full Purchase with Post-Payment Verification
**Date**: 2025-06-12
**Reporter**: QA Automation Team

---

## Summary

The OCAPI endpoint `OCAPI.Payments.AddGiftCardPayment` returns HTTP 429 (Too Many Requests) during automated gift card payment flows in the Lab environment. The response includes a `blockedUntil` timestamp, preventing gift card payments from completing. This causes the booking confirmation page to never load, resulting in a timeout.

## Steps to Reproduce

1. Navigate to Cinemas → Select Oasiz
2. Select a Normal film and showtime
3. Select 1 seat → Confirm seats
4. Continue as Guest
5. Select ticket → Skip Bar → Accept and Continue
6. On Payment page, enter Gift Card number and PIN
7. Click "Añadir tarjeta regalo" (Add gift card)
8. Observe the API call `AddGiftCardPayment` in network tab

**Expected**: Gift card is added to the payment, amount is deducted, purchase completes
**Actual**: API returns HTTP 429 with `blockedUntil` timestamp. Payment flow hangs. Booking confirmation never loads.

## Technical Details

### API Response

```
Endpoint: OCAPI.Payments.AddGiftCardPayment
HTTP Status: 429 Too Many Requests
Response Body: { "blockedUntil": "<ISO-8601 timestamp>" }
```

### Evidence

- **Playwright Trace**: Available in `.allure/playwright-artifacts/` for the failed test
- **Test**: `Checkout · Gift Card · Full Purchase with Post-Payment Verification — Oasiz`
- **Error**: `TimeoutError: waiting for booking confirmation page` (after gift card payment attempt)

### Affected Test Flow

```
Movies → Cinema → SeatPicker → TicketPicker → Bar → PurchaseSummary → [Payment: AddGiftCardPayment → 429] → ❌ BookingConfirmation never reached
```

## Root Cause Analysis

The Lab environment's OCAPI rate limiter appears to be too aggressive for automated test execution. Even with a single test run (1 worker), the gift card payment endpoint returns 429 after a small number of requests in succession.

Possible factors:

- **Shared rate limit bucket**: Multiple QA runs/manual tests may share the same rate limit pool
- **Low rate limit threshold in Lab**: Lab environment may have production-level rate limits despite lower traffic expectations
- **Gift card number reuse**: The test gift card number may have a per-card rate limit

## Impact

- **Blocking**: Cannot verify full gift card payment flow end-to-end in Lab
- **Tests affected**: 2 tests directly (`checkout.giftcard.spec.ts`), plus any test reusing `completeGiftCardPayment()`
- **CI/CD impact**: Gift card tests will be flaky/failing in automated pipelines

## Suggested Resolution

1. **Increase rate limit for Lab environment** on `OCAPI.Payments.AddGiftCardPayment` endpoint
2. **Whitelist test IP/user-agent** from rate limiting in Lab
3. **Provide multiple test gift cards** to distribute requests across different card numbers
4. **Add `Retry-After` header** to the 429 response so clients can implement backoff

## Workaround (Test Suite)

- Skip gift card tests when rate-limited (detect 429 and `test.skip()`)
- Add retry with exponential backoff in `paymentPage.completeGiftCardPayment()`
- Schedule gift card tests in isolated CI runs with cooldown periods

---

## JIRA Fields Suggestion

| Field               | Value                                                          |
| ------------------- | -------------------------------------------------------------- |
| **Project**         | COMS                                                           |
| **Issue Type**      | Bug                                                            |
| **Priority**        | High                                                           |
| **Labels**          | `rate-limit`, `payment`, `lab-environment`, `gift-card`, `api` |
| **Components**      | Checkout, Payments                                             |
| **Environment**     | Lab                                                            |
| **Affects Version** | Current Lab deployment                                         |
| **Sprint**          | Current                                                        |
