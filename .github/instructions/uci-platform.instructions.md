---
applyTo: 'pageObjectsManagers/uci/**,tests/uci/**,fixtures/uci/**'
---

# UCI Platform (Italy) Rules

## Scope

UCI is a smaller platform than Cinesa with 5 components: `cinemas`, `cookies`, `films`, `navbar`, `promoModal`.

## Configuration

- Use `getUCIConfig(env)` and `getUCIUrls()` — NEVER use getCinesa functions in UCI context
- Environments: `production`, `staging`, `development`
- Region: `it`
- Locale: `it-IT`

## URL Paths (Italian)

| Section     | Path          |
| ----------- | ------------- |
| Cinemas     | `/cinema`     |
| Films       | `/film`       |
| Promotions  | `/offerte`    |
| Experiences | `/esperienze` |
| Membership  | `/membership` |
| e-Shop      | `/e-shop`     |
| Sign In     | `/accedi`     |
| Sign Up     | `/registrati` |

## Fixtures

Import from `fixtures/uci/playwright.fixtures.ts`. All UCI tests must include `@uci` tag.

## Allure Labels

```typescript
await allure.epic('UCI Platform'); // NOT 'Cinesa Platform'
await allure.feature('Films - Content Catalog');
```

## Playwright Project

UCI uses `getUCICinemasProject()` in `playwright.config.ts`. Run with: `npm run test:it`
