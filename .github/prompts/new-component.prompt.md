---
description: 'Scaffold a complete new component following the layered architecture (POM, selectors, tests, assertions, data, fixture)'
---

# New Component Scaffold

Create a **complete component** for the cinema test automation framework.

## Component: ${input:componentName}

## Platform: ${input:platform}

Generate all files following the architecture rules:

### 1. Selectors File — `pageObjectsManagers/${input:platform}/${input:componentName}/${input:componentName}.selectors.ts`

- Define `${input:componentName}Selectors` interface
- Export typed const `${input:componentName}Selectors`
- Use `data-testid` attributes where possible

### 2. Page Object — `pageObjectsManagers/${input:platform}/${input:componentName}/${input:componentName}.page.ts`

- Constructor receives `Page` + optional `baseUrl`, creates `WebActions` internally
- Import selectors from the selectors file
- Every method async, returns `Promise<void>` or concrete type
- Wrap actions in `allure.step()`
- Use `import { allure } from 'allure-playwright'`

### 3. Test Data — `tests/${input:platform}/${input:componentName}/${input:componentName}.data.ts`

- Import `getCinesaConfig` (or `getUCIConfig` for UCI platform)
- Build URLs dynamically from `config.baseUrl`
- Clean trailing slash from baseUrl
- Export getter function `get${input:componentName}Data()`

### 4. Assertions — `tests/${input:platform}/${input:componentName}/${input:componentName}.assertions.ts`

- Constructor receives `Page` directly
- Import selectors from POM directory
- Every method wraps in `allure.step()`
- Use `expect()` from `@playwright/test`

### 5. Test Spec — `tests/${input:platform}/${input:componentName}/${input:componentName}.spec.ts`

- Import `test` from `fixtures/${input:platform}/playwright.fixtures.ts` (NEVER from `@playwright/test`)
- `beforeEach`: set `allure.epic()`, `allure.feature()`, navigate, handle cookies
- Use middot (·) naming: `'${input:componentName} · Section · Action'`
- Include tags: `{ tag: ['@${input:componentName}', '@${input:platform}', '@smoke'] }`

### 6. Fixture Registration — Update `fixtures/${input:platform}/playwright.fixtures.ts`

- Import the new Page Object
- Add to `CustomFixtures` type
- Add fixture definition using WebActions pattern

Follow all rules from `.github/copilot-instructions.md`. All code in English.
