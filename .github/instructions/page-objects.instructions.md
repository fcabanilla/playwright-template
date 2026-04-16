---
applyTo: 'pageObjectsManagers/**/*.page.ts'
---

# Page Object Layer Rules

## Constructor Pattern

The constructor receives `Page` and optionally `baseUrl`. It MUST create `WebActions` internally. Never use `page` directly in any method.

```typescript
constructor(page: Page, baseUrl?: string) {
  this.webActions = new WebActions(page);
  this.selectors = componentSelectors;
  this.url = baseUrl || 'https://www.cinesa.es/';
}
```

## Imports

```typescript
import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';
import { componentSelectors, ComponentSelectors } from './component.selectors';
import { WebActions } from '../../../core/webactions/webActions';
```

Never use `import * as allure` — always use `import { allure }`.

## Method Pattern

Every public method is `async`, returns `Promise<void>` or a concrete type, and wraps its logic in `allure.step()`:

```typescript
async navigateToSection(): Promise<void> {
  await allure.step('Navigating to section', async () => {
    await this.webActions.clickWithOverlayHandling(this.selectors.sectionLink);
  });
}
```

## Available WebActions Methods

Use ONLY these — never call `this.webActions.getPage()` to bypass the abstraction:

- `navigateTo(url)` — navigation
- `navigateToWithConsent(url)` — navigation with OneTrust consent seeds
- `click(selector, targetName?)` — standard click (uses `force: true`)
- `clickWithOverlayHandling(selector, targetName?)` — click with overlay detection
- `clickAndWait(selector, targetName?)` — click + wait for networkidle
- `fill(selector, text, fieldName?)` — input fill (auto-masks sensitive data)
- `getText(selector)` — get text content
- `getInputValue(selector)` — get input value
- `isVisible(selector)` — boolean visibility check
- `waitForVisible(selector, timeout?, targetName?)` — wait until visible
- `hover(selector, targetName?)` — hover action
- `getElementCount(selector)` — count matching elements
- `scrollIntoView(selector)` — scroll element into viewport
- `evaluate(script, arg?)` — execute JS in browser context
- `waitForLoadState(state)` — wait for load state
- `getLocator(selector)` — get Playwright Locator (use sparingly)
- `screenshot(path?)` — take screenshot
- `wait(ms)` — explicit wait (avoid if possible)

## Reference Model

Follow the pattern in `pageObjectsManagers/cinesa/navbar/navbar.page.ts`.
