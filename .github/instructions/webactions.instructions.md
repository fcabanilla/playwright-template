---
applyTo: 'core/webactions/**'
---

# WebActions Layer Rules

This is the ONLY layer that imports and uses the Playwright API (`Page`, `Locator`) directly. All other layers delegate through WebActions.

## Allure Step Taxonomy (ADR-0015)

Every public method that performs a user-observable action MUST create an Allure step with this format:

```
[PREFIX] Verb | Key=Value | Key=Value
```

### Prefixes

| Prefix     | Category        | Example                                          |
| ---------- | --------------- | ------------------------------------------------ |
| `[NAV]`    | Navigation      | `[NAV] Goto \| URL=/peliculas \| Env=production` |
| `[ACT]`    | User actions    | `[ACT] Click \| Target=loginButton`              |
| `[WAIT]`   | Wait conditions | `[WAIT] Visible \| Target=modal \| Timeout=5.0s` |
| `[ASSERT]` | Verifications   | `[ASSERT] URL \| Expected=/cines/`               |
| `[DATA]`   | Data operations | `[DATA] Apply consent seeds \| Host=cinesa.es`   |

## Step Utilities (`./steps.ts`)

```typescript
import { step, mask, truncate } from './steps';

// step() wraps allure.step() — use for creating named steps
await step('[ACT] Click | Target=loginButton', async () => { ... });

// mask() hides sensitive data, keeping last N chars
mask('user@test.com', 4);  // '••••••••.com'

// truncate() limits string length
truncate(longString, 80);  // 'first 80 chars…'
```

## Sensitive Data Masking

Always mask values in `fill()`:

```typescript
const displayValue = mask(truncate(text, 80));
// Step shows: [ACT] Fill | Field=emailInput | Value=••••••••.com
```

## Click Behavior

All clicks use `force: true` to bypass OneTrust overlay banners.

## Optional Target Names

Methods accept optional `targetName?` / `fieldName?` for better Allure traceability. When not provided, the step shows a truncated selector instead.

## Navigation Logging

`navigateTo()` extracts the relative path and detects the current environment for the step log, showing clean output like `[NAV] Goto | URL=/peliculas | Env=production` instead of full URLs.
