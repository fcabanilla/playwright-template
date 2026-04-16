---
description: 'Migrate a legacy Page Object that uses page directly to the WebActions-only pattern (ADR-0009)'
---

# Migrate Page Object to WebActions Pattern

Refactor a legacy Page Object that accesses Playwright's `page` API directly so it only uses `WebActions`.

## Target: ${input:componentPath}

### Migration Steps

#### 1. Extract Selectors

Move all inline selectors (strings in `page.locator()`, `page.click()`, etc.) to a separate `*.selectors.ts` file:

```typescript
// component.selectors.ts
export interface ComponentSelectors { ... }
export const componentSelectors: ComponentSelectors = { ... };
```

#### 2. Refactor Constructor

**Before (legacy):**

```typescript
constructor(private readonly page: Page) {}
```

**After (correct):**

```typescript
constructor(page: Page, baseUrl?: string) {
  this.webActions = new WebActions(page);
  this.selectors = componentSelectors;
}
```

#### 3. Replace page API Calls

| Legacy (remove)                      | WebActions (use)                                                      |
| ------------------------------------ | --------------------------------------------------------------------- |
| `this.page.click(sel)`               | `this.webActions.click(this.selectors.key, 'targetName')`             |
| `this.page.fill(sel, val)`           | `this.webActions.fill(this.selectors.key, val, 'fieldName')`          |
| `this.page.goto(url)`                | `this.webActions.navigateTo(url)`                                     |
| `this.page.locator(sel).isVisible()` | `this.webActions.isVisible(this.selectors.key)`                       |
| `this.page.waitForSelector(sel)`     | `this.webActions.waitForVisible(this.selectors.key, timeout, 'name')` |
| `this.page.textContent(sel)`         | `this.webActions.getText(this.selectors.key)`                         |
| `this.page.locator(sel)`             | `this.webActions.getLocator(this.selectors.key)` (sparingly)          |

#### 4. Add Allure Steps

Wrap business-logic methods with `allure.step()`:

```typescript
async performAction(): Promise<void> {
  await allure.step('Performing action', async () => {
    await this.webActions.click(this.selectors.actionButton, 'actionButton');
  });
}
```

#### 5. Update Fixture

Ensure the fixture passes `page` (and optionally `baseUrl`) to the refactored POM.

#### 6. Verify

Run existing tests to confirm behavior is preserved:

```bash
npm run report:clean:results
npx playwright test tests/cinesa/${input:componentPath}/ --project='Cinesa'
```

Reference: `docs/adrs/0009-page-object-architecture-rules.md`
