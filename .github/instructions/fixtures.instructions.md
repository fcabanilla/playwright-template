---
applyTo: 'fixtures/**/*.ts'
---

# Fixtures (Dependency Injection) Rules

## Standard Fixture Pattern

```typescript
componentName: async ({ page }, use) => {
  const webActions = new WebActions(page);
  await use(new ComponentPage(webActions));
},
```

## POMs That Need baseUrl

Some POMs (like `Navbar`) accept `page` + `baseUrl` and create WebActions internally:

```typescript
navbar: async ({ page }, use) => {
  await use(new Navbar(page, config.baseUrl));
},
```

## Assertion Fixtures

Assertions that depend on a POM fixture:

```typescript
componentAssertions: async ({ component }, use) => {
  await use(new ComponentAssertions(component));
},
```

## Adding a New Fixture

1. Import the POM: `import { ComponentPage } from '../../pageObjectsManagers/cinesa/component/component.page';`
2. Add to `CustomFixtures` type: `componentName: ComponentPage;`
3. Add the fixture definition following the standard pattern above
4. Never remove existing fixtures without checking all `*.spec.ts` files for usage

## Context Override (CRITICAL)

The `context` fixture override in Cinesa fixtures handles:

1. Native User-Agent extraction from real browser
2. StorageState loading (persisted cookie consent via `getCinesaStorageStatePath(env)`)
3. Cloudflare headers + cookies injection for `.ocgtest.es` domains (preprod/lab)
4. Automatic consent seed application if no storageState found

Do NOT modify the context override without understanding the full chain. Changes affect ALL tests.

## Legacy Patterns

Some fixtures still pass `page` directly to POMs (e.g., `MoviePage`, `Mailing`). These are migration candidates — new fixtures should always use the WebActions pattern.

## Reference

`fixtures/cinesa/playwright.fixtures.ts` — 30+ fixtures defined
