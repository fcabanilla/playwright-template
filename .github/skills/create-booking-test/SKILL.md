---
name: create-booking-test
description: 'Create a parametrized booking flow test for one or more cinemas through the full purchase journey: Movie → Cinema → Seats → Tickets → Bar → Summary → Payment. Use when: adding end-to-end booking tests, testing new cinemas through the full flow, creating purchase regression tests.'
argument-hint: 'Cinema name or describe which booking steps to cover'
---

# Create Booking Flow Test

Generate a **complete booking flow test** that goes through the full purchase journey.

## Booking Flow Sequence

1. **Movies** → Select film
2. **Cinemas** → Choose cinema location
3. **SeatPicker** → Select seats
4. **TicketPicker** → Choose ticket types
5. **Bar** → Food & Beverages (optional)
6. **PurchaseSummary** → Review order
7. **Payment** → Complete purchase (test cards only)

## Key Rules

- Use `getCinemasForEnvironment()` from `config/cinemas.config.ts` for automatic environment filtering
- Import `test` from `fixtures/cinesa/playwright.fixtures.ts` (NEVER from `@playwright/test`)
- Tag with `@e2e`, `@booking`, and cinema-specific tags
- Each cinema gets its own test via parametrization loop — never duplicate tests
- Use middot (·) naming convention: `'Booking · Complete Purchase · E2E — {Cinema}'`
- All fixtures injected via DI — never instantiate directly
- Set `allure.epic()`, `allure.feature('Booking Flow - Complete Purchase')` in `beforeEach`
- Handle navigation + cookies + promotional modal in `beforeEach`

## Reference

See existing booking tests in `tests/cinesa/` and the booking-flow-tester agent for flow details.
