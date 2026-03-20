---
applyTo: 'tests/**/*.assertions.ts'
---

# Assertions File Rules

## Class Structure

Assertions receive `Page` in the constructor — this is the ONLY layer besides WebActions that accesses `page` directly (ADR-0009).

```typescript
import { Page, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import {
  componentSelectors,
  ComponentSelectors,
} from '../../../pageObjectsManagers/cinesa/component/component.selectors';

export class ComponentAssertions {
  readonly page: Page;
  readonly selectors: ComponentSelectors;

  constructor(page: Page) {
    this.page = page;
    this.selectors = componentSelectors;
  }
}
```

## Method Pattern

Every assertion method wraps in `allure.step()` and uses Playwright's `expect()`:

```typescript
async expectElementVisible(): Promise<void> {
  await allure.step('Verify element is visible', async () => {
    await expect(this.page.locator(this.selectors.element)).toBeVisible();
  });
}
```

## Naming Convention

`expect{What}{Condition}()` — e.g., `expectNavbarElementsVisible()`, `expectHomeUrl(url)`, `expectNavClick(selector, expectedUrl)`

## Multiple Elements Validation

Iterate with nested sub-steps:

```typescript
async expectAllItemsVisible(): Promise<void> {
  await allure.step('Verifying all items visibility', async () => {
    for (const item of items) {
      await allure.step(`Verify '${item.name}' is visible`, async () => {
        await expect(this.page.locator(item.selector)).toBeVisible();
      });
    }
  });
}
```

## Dynamic Values

Use `allure.parameter()` inside steps to report values in Allure:

```typescript
await allure.parameter('Found', isVisible ? 'Yes' : 'No');
```

## External Navigation (Popup Handling)

For links that open new tabs, use `page.waitForEvent('popup')` with try/catch fallback to same-tab navigation, as shown in `tests/cinesa/navbar/navbar.assertions.ts`.

## Reference Model

`tests/cinesa/navbar/navbar.assertions.ts`
