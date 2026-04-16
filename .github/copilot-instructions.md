# Copilot Instructions - Cinema Multi-Platform Test Automation

Multi-platform Playwright test automation for cinema chains (Cinesa, UCI). Strict layered architecture enforcing maintainability, type safety, and separation of concerns.

> Layer-specific rules load automatically from `.github/instructions/` when editing matching files. This file covers cross-cutting rules only.

## Architecture (ADR-0009)

```
Tests/Assertions ──→ Page Objects ──→ WebActions ──→ Playwright API
```

- **WebActions-only**: Page Objects NEVER access `page` directly — all Playwright calls go through `WebActions`
- **Selector separation**: All selectors in `*.selectors.ts` — no inline selectors
- **Fixture injection**: Import `test` from `fixtures/`, never `@playwright/test`. Never instantiate POMs directly
- **Assertions layer**: Receive `Page` directly (only exception), use `allure.step()` + `expect()`

## Component Structure

```
pageObjectsManagers/[platform]/component/    tests/[platform]/component/
├── component.page.ts (WebActions ONLY)      ├── component.spec.ts
├── component.selectors.ts                   ├── component.assertions.ts
└── component.types.ts (optional)            ├── component.data.ts
                                             └── component.helpers.ts (optional)
```

## Platforms & Environments

| Platform       | Tests           | POMs                          | Fixtures                               |
| -------------- | --------------- | ----------------------------- | -------------------------------------- |
| Cinesa (ES/PT) | `tests/cinesa/` | `pageObjectsManagers/cinesa/` | `fixtures/cinesa/playwright.fixtures.ts` |
| UCI (IT)       | `tests/uci/`    | `pageObjectsManagers/uci/`    | `fixtures/uci/playwright.fixtures.ts`    |

Environments via `TEST_ENV`: `production` (default), `preprod`, `lab`. Config in `config/environments.ts`. URLs in `config/urls.ts`.

## Allure 2 Reporting (CRITICAL)

```typescript
// ✅ CORRECT — Allure 2 API
import { allure } from 'allure-playwright';
await allure.step('Step description', async () => { /* ... */ });

// ❌ WRONG — Allure 3 not supported
import * as allure from 'allure-playwright';       // ❌
await allure.test.step('...', async () => {});      // ❌
```

All tests MUST have `epic`/`feature`/`story` labels. Always run `npm run report:clean:results` before test execution. Never delete `.allure/report/history/`.

## Planning Protocol (ALWAYS ACTIVE)

Before acting, assess task complexity:

- **Simple** (single-file edit, quick lookup, clear intent): execute directly
- **Complex** (multi-file, architectural decisions, ambiguous scope, unfamiliar domain): **plan first**

For complex tasks, produce a plan in this format before any implementation:

```markdown
## Análisis
Brief context assessment — what exists, what's needed, what's unclear.

## Plan
Numbered steps with specific files/components affected.

## Preguntas (if any)
Clarifying questions about unknowns — ASK, don't guess.

## Siguiente paso
First concrete action to take once approved.
```

**Critical rules**:
- When vital information is missing, **ask clarifying questions** — never fabricate assumptions
- Present the plan and **wait for approval** before executing
- Use the built-in `/plan` command or `@plan` agent for deep multi-step planning sessions

## Code Quality

- **Language**: ALL code in English. Spanish only in test data representing real content
- **TypeScript**: Strict mode, no `any` without justification, prefer interfaces
- **Naming**: camelCase variables, PascalCase classes, middot (·) in test names
- **Commits**: Conventional format (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`)

## Prohibitions (NEVER do unless explicitly asked)

### Architecture
- Access `page` in Page Objects — use `WebActions`
- Inline selectors — extract to `*.selectors.ts`
- Hardcode URLs — use `config/environments.ts` + `*.data.ts`
- Import `test` from `@playwright/test` — use fixtures
- Duplicate tests for variants — use parametrization with `getCinemasForEnvironment()`
- Code in Spanish
- Add docstrings, comments, or type annotations to code you didn't modify
- Refactor or "improve" code beyond what was explicitly requested (minor fixes in affected files are OK)
- Create abstractions or helpers for one-time operations
- Use `any` without a documented justification comment

### Operational
- **Run tests against `production`** — production is OUT OF SCOPE by default. Only run against production when the user explicitly says so. If `TEST_ENV` is not set, ASK before executing
- Hardcode credentials — use `.env` + `config/testAccounts.ts`
- Delete `storage-state` files or `.allure/report/history/`
- Run `npx playwright test` without `npm run report:clean:results` first
- Create `.spec.ts` files without Allure labels (`epic`/`feature`/`story`)

## Continuous Learning (ALWAYS ACTIVE)

After EVERY response where you discovered something new (environment behavior, tool gotcha, infrastructure quirk, debugging insight, pattern that worked/failed), append a `💡 Suggested improvement` block. See `context-engineering.instructions.md` for the full template. **No exceptions** — if you learned it, suggest it.

## Key Files

| File | Purpose |
| ---- | ------- |
| `core/webactions/webActions.ts` | Playwright API wrapper (ONLY layer accessing Playwright) |
| `config/environments.ts` | baseUrl, timeouts, features per env/platform |
| `config/urls.ts` | `getCinesaUrls()`, `getUCIUrls()` |
| `config/cinemas.config.ts` | Cinema parametrization |
| `fixtures/cinesa/playwright.fixtures.ts` | 30+ Cinesa fixtures |
| `playwright.config.ts` | Test configuration |
| `docs/adrs/0009-page-object-architecture-rules.md` | Architecture rules |
