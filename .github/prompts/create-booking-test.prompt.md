---
description: 'Create a parametrized booking flow test for one or more cinemas through the full purchase journey'
---

# Create Booking Flow Test

Generate a **complete booking flow test** that goes through the full purchase journey: Movie → Cinema → Seats → Tickets → Bar → Summary → Payment.

## Cinema: ${input:cinemaName}

## Test Type: ${input:testType}

### Structure

Create `tests/cinesa/bookingFlow/${input:cinemaName}BookingFlow.spec.ts` following this pattern:

```typescript
import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { getCinemasForEnvironment } from '../../../config/cinemas.config';

const CINEMAS = getCinemasForEnvironment();

test.describe('Booking Flow Tests', () => {
  test.beforeEach(async ({ page, navbar, cookieBanner, promotionalModal }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Booking Flow - Complete Purchase');
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
  });

  for (const cinema of CINEMAS) {
    test(
      `Booking · Complete Purchase · E2E — ${cinema.name}`,
      { tag: ['@e2e', '@booking', '@cinesa', ...cinema.tags] },
      async ({
        cinemaPage,
        seatPicker,
        ticketPicker,
        bar,
        purchaseSummary,
      }) => {
        await allure.story(`Complete booking flow at ${cinema.name}`);
        // Step-by-step flow using fixtures
      }
    );
  }
});
```

### Key Rules

- Use `getCinemasForEnvironment()` for automatic environment filtering
- Tag with `@e2e`, `@booking`, and cinema-specific tags
- Each cinema gets its own test via parametrization loop
- Use middot (·) naming convention
- All fixtures injected via DI — never instantiate directly
- Handle before each: navigate + cookies + promotional modal
