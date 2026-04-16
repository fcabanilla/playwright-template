# AGENTS.md

Multi-platform Playwright test automation for cinema chains (Cinesa, UCI). Strict layered architecture: Tests → Page Objects → WebActions → Playwright API.

## Repository Structure

```
config/                  # environments.ts, urls.ts, cinemas.config.ts
core/webactions/         # WebActions — ONLY layer accessing Playwright API
fixtures/cinesa/         # 30+ Cinesa fixtures (playwright.fixtures.ts)
fixtures/uci/            # UCI fixtures
pageObjectsManagers/
  cinesa/<component>/    # <component>.page.ts, .selectors.ts, .types.ts
  uci/<component>/
tests/
  cinesa/<component>/    # <component>.spec.ts, .assertions.ts, .data.ts
  uci/<component>/
docs/adrs/               # Architecture Decision Records
playwright.config.ts     # Test configuration
```

## Setup

```bash
npm install && npx playwright install
npx playwright test --project=setup    # Generate consent storage states (required)
```

## Running Tests

```bash
npm run test:cinesa                    # All Cinesa tests
npm run test:uci                       # All UCI tests
npm run test:navbar                    # By component
TEST_ENV=preprod npm run test:cinesa   # By environment (production|preprod|lab)
npm run test:cinesa:cloudflare         # Headed mode for Cloudflare-protected envs
npm run report:clean:results           # MUST run before each test execution
npm run report                         # Generate Allure report (preserves history)
```

## Architecture Rules

1. **WebActions-only** — Page Objects never access `page` directly
2. **Selector separation** — All selectors in `*.selectors.ts`, no inline selectors
3. **Fixture injection** — Import `test` from `fixtures/`, never `@playwright/test`
4. **Assertions layer** — Assertions in `*.assertions.ts` with `allure.step()` + `expect()`
5. **Allure 2 API** — `import { allure } from 'allure-playwright'` (NOT `import * as allure`)
6. **Production protection** — Never execute tests against production unless explicitly requested. Default `TEST_ENV` is `production` — always set `TEST_ENV=preprod` or `TEST_ENV=lab` unless told otherwise
7. **Continuous learning** — When discovering patterns, gotchas, or improvements, suggest customization updates at the end of the response

Full rules: `docs/adrs/0009-page-object-architecture-rules.md`

## Code Style

- ALL code in English (Spanish only in test data representing real content)
- TypeScript strict mode, no `any` without justification
- camelCase variables, PascalCase classes, middot (·) in test names
- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`

## Key Files

| File | Purpose |
| ---- | ------- |
| `core/webactions/webActions.ts` | Playwright API wrapper |
| `config/environments.ts` | baseUrl, timeouts, features per env |
| `config/urls.ts` | `getCinesaUrls()`, `getUCIUrls()` |
| `config/cinemas.config.ts` | Cinema parametrization |
| `fixtures/cinesa/playwright.fixtures.ts` | Cinesa fixture definitions |
| `.github/copilot-instructions.md` | Copilot coding guidelines |
| `docs/adrs/0009-page-object-architecture-rules.md` | Architecture rules |

## Environment Variables

```bash
TEST_ENV=production|preprod|lab    # Target environment (default: production)
ALLURE_RESULTS_DIR=.allure/results # Allure output directory
```

## Before Committing

```bash
npm run lint && npx tsc --noEmit   # Lint + type check
```

## Planning Protocol

For complex tasks (multi-file, architectural, ambiguous), **plan before implementing**:
1. Assess scope → 2. Ask clarifying questions → 3. Produce written plan → 4. Wait for approval → 5. Execute

Use `@plan` agent or `/plan` command for deep planning sessions. Simple tasks execute directly.
