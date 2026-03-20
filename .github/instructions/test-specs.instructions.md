---
applyTo: 'tests/**/*.spec.ts'
---

# Test Specification Rules

## Imports — Always from Fixtures

```typescript
import { test } from '../../../fixtures/cinesa/playwright.fixtures'; // or uci
import { allure } from 'allure-playwright';
import { ComponentAssertions } from './component.assertions';
import { getComponentData } from './component.data';
```

NEVER import `test` from `@playwright/test`. NEVER instantiate Page Objects directly.

## Allure Labels (MANDATORY)

```typescript
test.beforeEach(async ({ page, navbar, promotionalModal }) => {
  await allure.epic('Cinesa Platform'); // Platform level
  await allure.feature('Navbar - Main Navigation'); // Component level (see table below)
  assertions = new ComponentAssertions(page);
  await navbar.navigateToHome();
  await promotionalModal.closeModalIfVisible();
});

test('...', async ({ navbar }) => {
  await allure.story('Display navbar elements'); // Per test
  await allure.parameter('key', 'value'); // Relevant data
});
```

### Standardized Feature Names

| Component       | Feature Label                   |
| --------------- | ------------------------------- |
| navbar          | Navbar - Main Navigation        |
| footer          | Footer - Site Navigation        |
| movies          | Movies - Content Catalog        |
| cinemas         | Cinemas - Location Finder       |
| blog            | Blog - Content Platform         |
| seatPicker      | Seat Picker - Seat Selection    |
| bar             | Bar & Food Services             |
| ticketPicker    | Ticket Picker - Entry Selection |
| purchaseSummary | Purchase Summary - Order Review |
| login           | Authentication - User Access    |
| signup          | Registration - New Users        |
| promotions      | Promotions - Marketing          |
| programs        | Loyalty Programs - Rewards      |
| analytics       | Analytics - Tracking            |

## Test Naming

Use middot (·) as separator: `'Component · Section · Action · Details — Cinema (optional)'`

```typescript
test('Navbar · Visibility · Display · All elements', ...)
test('Seat Picker · Complete Purchase · Purchase · Single seat — Oasiz', ...)
```

## Tags

```typescript
test('Name', { tag: ['@component', '@cinesa', '@smoke'] }, async ({ fixture }) => { ... });
```

Common: `@smoke`, `@critical`, `@fast`, `@regression`, `@e2e`, `@cinesa`, `@uci`

## Data-Driven Parametrization

```typescript
import { getCinemasForEnvironment } from '../../../config/cinemas.config';
const CINEMAS = getCinemasForEnvironment();

for (const cinema of CINEMAS) {
  test(
    `Flow · Purchase · Complete — ${cinema.name}`,
    { tag: ['@e2e', '@booking', ...cinema.tags] },
    async ({ seatPicker }) => {
      await allure.story(`Complete purchase flow at ${cinema.name}`);
      // ...
    }
  );
}
```

## JIRA Tags in Stories

```typescript
test(
  'Movie Schema URL validation',
  { tag: ['@movies', '@OCG-3316'] },
  async ({ moviePage }) => {
    await allure.story('OCG-3316 - Movie Schema URL validation');
  }
);
```

## Reference Model

`tests/cinesa/navbar/navbar.spec.ts`
