---
name: new-component
description: 'Scaffold a complete new component following the layered architecture: Page Object with WebActions, selectors file, test spec with Allure labels, assertions with allure.step, test data with dynamic URLs, and fixture registration. Use when: adding a new page/component to the framework, creating a new test target, bootstrapping component files.'
argument-hint: 'Component name and platform (e.g. "promotions for cinesa")'
---

# New Component Scaffold

Create a **complete component** for the cinema test automation framework. The user will provide the component name and platform.

## Required Files

Generate all files following the architecture rules:

### 1. Selectors File — `pageObjectsManagers/{platform}/{component}/{component}.selectors.ts`

- Define `{Component}Selectors` interface with all selector keys
- Export typed const with `as const`
- Use `data-testid` attributes where possible

### 2. Page Object — `pageObjectsManagers/{platform}/{component}/{component}.page.ts`

- Constructor receives `Page` + optional `baseUrl`, creates `WebActions` internally
- Import selectors from the selectors file
- Every method async, returns `Promise<void>` or concrete type
- Wrap actions in `allure.step()`
- Use `import { allure } from 'allure-playwright'`

### 3. Test Data — `tests/{platform}/{component}/{component}.data.ts`

- Import `getCinesaConfig` (or `getUCIConfig` for UCI)
- Build URLs dynamically from `config.baseUrl`
- Export getter function `get{Component}Data()`

### 4. Assertions — `tests/{platform}/{component}/{component}.assertions.ts`

- Constructor receives `Page` directly
- Import selectors from POM directory
- Every method wraps in `allure.step()`
- Use `expect()` from `@playwright/test`

### 5. Test Spec — `tests/{platform}/{component}/{component}.spec.ts`

- Import `test` from `fixtures/{platform}/playwright.fixtures.ts` (NEVER from `@playwright/test`)
- `beforeEach`: set `allure.epic()`, `allure.feature()`, navigate, handle cookies
- Use middot (·) naming: `'{Component} · Section · Action'`
- Include tags: `{ tag: ['@{component}', '@{platform}', '@smoke'] }`

### 6. Fixture Registration — Update `fixtures/{platform}/playwright.fixtures.ts`

- Import the new Page Object
- Add to `CustomFixtures` type
- Add fixture definition using WebActions pattern

## Reference

Follow all rules from `.github/copilot-instructions.md` and `.github/instructions/`. All code in English.
