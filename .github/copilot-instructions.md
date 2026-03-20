# Copilot Instructions - Cinema Multi-Platform Test Automation

## Project Context

Multi-platform Playwright test automation framework for cinema chains (Cinesa, UCI) with strict architectural patterns. Emphasizes maintainability, type safety, and separation of concerns through enforced layer boundaries.

> **Layer-specific rules are in `.github/instructions/`** — they load automatically when editing matching files. This file covers cross-cutting rules only.

## Critical Architecture Rules

### Layered Architecture (ADR-0009)

```
Tests/Assertions ──→ Page Objects ──→ WebActions ──→ Playwright API
```

| Rule                    | Summary                                                                                                  | Details in                                  |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| **WebActions-only**     | Page Objects NEVER access `page` directly — all Playwright API calls go through `WebActions`             | `instructions/page-objects.instructions.md` |
| **Selector separation** | All selectors live in `*.selectors.ts` files — no inline selectors in POMs or tests                      | `instructions/selectors.instructions.md`    |
| **Fixture injection**   | Tests import `test` from `fixtures/`, never from `@playwright/test`. Never instantiate POMs directly     | `instructions/fixtures.instructions.md`     |
| **Assertions layer**    | Assertions receive `Page` directly (only exception to WebActions rule), use `allure.step()` + `expect()` | `instructions/assertions.instructions.md`   |

### Component Structure

```
📁 pageObjectsManagers/[platform]/componentName/
├── componentName.page.ts       # Business logic (WebActions ONLY)
├── componentName.selectors.ts  # All CSS/XPath selectors
└── componentName.types.ts      # TypeScript interfaces (optional)

📁 tests/[platform]/componentName/
├── componentName.spec.ts       # Test cases
├── componentName.assertions.ts # Assertions (with Allure steps)
├── componentName.data.ts       # Test data: URLs, expected values
└── componentName.helpers.ts    # Test utilities (optional)
```

Use the `# new-component` prompt in Copilot Chat to scaffold a complete component.

## Multi-Platform Architecture

### Platforms

| Platform           | Tests           | POMs                          | Fixtures                                 |
| ------------------ | --------------- | ----------------------------- | ---------------------------------------- |
| **Cinesa** (ES/PT) | `tests/cinesa/` | `pageObjectsManagers/cinesa/` | `fixtures/cinesa/playwright.fixtures.ts` |
| **UCI** (IT)       | `tests/uci/`    | `pageObjectsManagers/uci/`    | `fixtures/uci/playwright.fixtures.ts`    |

### Environments

```bash
TEST_ENV=production npm test   # https://www.cinesa.es (default)
TEST_ENV=preprod npm test      # https://preprod-web.ocgtest.es
TEST_ENV=lab npm test          # https://lab-web.ocgtest.es
```

Configuration: `config/environments.ts` (baseUrl, timeouts, features per env/platform).
URLs: `config/urls.ts` (`getCinesaUrls()`, `getUCIUrls()` — adapt to `TEST_ENV` automatically).

### Cloudflare Protection (preprod/lab)

Cloudflare is present on preprod/lab environments. Use `--headed --workers=1`:

```bash
npm run test:cinesa:cloudflare    # Headed mode, workers=1
npm run test:uci:cloudflare
```

See `docs/CLOUDFLARE_HANDLING.md` for bypass strategies.

## Test Organization

### File Naming

| Pattern                 | Purpose                        |
| ----------------------- | ------------------------------ |
| `*.spec.ts`             | Standard tests                 |
| `*.quick.spec.ts`       | Fast smoke tests (<2min)       |
| `*.integration.spec.ts` | Cross-component flows          |
| `*-cloudflare.spec.ts`  | Tests with Cloudflare handling |

### Test Naming Convention

Use middot (·) as separator: `'Component · Section · Action · Details — Cinema (optional)'`

### Tags

| Category      | Tags                                                       |
| ------------- | ---------------------------------------------------------- |
| **Priority**  | `@smoke`, `@critical`, `@fast`, `@medium`, `@low-priority` |
| **Type**      | `@regression`, `@integration`, `@e2e`                      |
| **Platform**  | `@cinesa`, `@uci`                                          |
| **Component** | `@navbar`, `@films`, `@booking`, `@payment`, etc.          |

```bash
npx playwright test --grep "@smoke"              # Run by tag
npx playwright test --grep "@cinesa.*@navbar"    # Multiple tags
npm run test:cinesa:smoke                        # NPM shortcut
```

### Parametrization

Use data-driven patterns for test variants (cinemas, formats, promo codes). Never copy-paste tests for each cinema — use `getCinemasForEnvironment()` from `config/cinemas.config.ts`. Details in `instructions/test-specs.instructions.md`.

## Allure 2 Reporting

### API (CRITICAL)

```typescript
// ✅ CORRECT
import { allure } from 'allure-playwright';
await allure.step('Step description', async () => {
  /* ... */
});

// ❌ WRONG — Allure 3 API not supported
import * as allure from 'allure-playwright';
await allure.test.step('...', async () => {}); // Property 'test' does not exist
```

### Hierarchical Labels (MANDATORY)

All tests MUST include `epic`, `feature`, and `story`:

```typescript
test.beforeEach(async () => {
  await allure.epic('Cinesa Platform'); // Platform level — in beforeEach
  await allure.feature('Navbar - Main Navigation'); // Component level — in beforeEach
});

test('...', async () => {
  await allure.story('Display navbar elements'); // Scenario level — per test
});
```

**Standardized Feature Names:**

| Component       | Feature Label                   |
| --------------- | ------------------------------- |
| navbar          | Navbar - Main Navigation        |
| footer          | Footer - Site Navigation        |
| movies          | Movies - Content Catalog        |
| cinemas         | Cinemas - Location Finder       |
| blog            | Blog - Content Platform         |
| seatPicker      | Seat Picker - Seat Selection    |
| bar             | Bar & Food Services             |
| ticketPicker    | Ticket Picker - Entry Selection |
| purchaseSummary | Purchase Summary - Order Review |
| login           | Authentication - User Access    |
| signup          | Registration - New Users        |
| promotions      | Promotions - Marketing          |
| coupons         | Coupons - Discount System       |
| experiences     | Experiences - Premium Formats   |
| programs        | Loyalty Programs - Rewards      |
| analytics       | Analytics - Tracking            |
| mailing         | Mailing - Communications        |

Include JIRA tags in stories: `await allure.story('OCG-3316 - Movie Schema URL validation');`

### Results Accumulation (CRITICAL)

Allure accumulates results by design. **Always clean before each new execution:**

```bash
# 1. Clear old results (MANDATORY)
npm run report:clean:results

# 2. Run test(s)
npx playwright test tests/cinesa/seatPicker/seatPicker.spec.ts --project='Cinesa'

# 3. Generate report (preserves history for TREND graph)
npm run report
```

**Directories:**

| Directory                       | Purpose                     | Action                       |
| ------------------------------- | --------------------------- | ---------------------------- |
| `.allure/results/`              | Current execution JSON      | MUST clean before each run   |
| `.allure/report/history/`       | TREND graph data            | MUST preserve — never delete |
| `.allure/report/`               | Generated HTML report       | Regenerated each time        |
| `.allure/playwright-artifacts/` | Videos, screenshots, traces | Auto-managed                 |

See `docs/ALLURE_CATEGORIES.md` for full details.

## Booking Flow

Complete sequence:

1. **Movies** → Select film
2. **Cinemas** → Choose cinema
3. **SeatPicker** → Select seats
4. **TicketPicker** → Choose ticket types
5. **Bar** → Food & Beverages
6. **PurchaseSummary** → Review order
7. **Payment** → Complete purchase

Each component has implicit coverage through full booking tests even without explicit tests.

## Common Workflows

### Running Tests

```bash
npm run test:cinesa              # All Cinesa tests
npm run test:uci                 # All UCI tests
npm run test:navbar              # Specific component
TEST_ENV=preprod npm run test:cinesa  # Specific environment
```

### Debugging

```bash
npx playwright test --debug              # Step-through
npx playwright test --headed             # Visual mode
npx playwright test --trace on           # Record trace
npx playwright codegen https://cinesa.es # Generate selectors
```

### Reports

```bash
npm run report                   # Full workflow: copy-history → generate → open
npm run report:generate          # Generate only
npm run report:clean:results     # Clean results (before new run)
npm run report:clean             # Clean all artifacts
```

## Code Quality Standards

- **Language:** ALL code in English (test names, variables, comments, functions). Spanish allowed only in test data representing real content.
- **TypeScript:** Strict mode, no `any` without justification, prefer interfaces over types.
- **ESLint:** Run `npm run lint` before commits. camelCase variables, PascalCase classes, no `console.log`.
- **Commits:** Conventional format: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`.

## Quick Reference — Do's and Don'ts

❌ Access `page` in Page Objects — use `WebActions`
❌ Inline selectors — extract to `*.selectors.ts`
❌ Hardcode URLs — use `config/environments.ts` + `*.data.ts`
❌ Import `test` from `@playwright/test` — use fixtures
❌ `import * as allure` — use `import { allure }`
❌ `allure.test.step()` — use `allure.step()`
❌ Skip Allure labels — add `epic`/`feature`/`story`
❌ Run tests without `npm run report:clean:results` first
❌ Delete `.allure/report/history/` — needed for TREND
❌ Code in Spanish
❌ Duplicate tests for variants — use parametrization

✅ `WebActions` for ALL Playwright interactions in POMs
✅ Fixtures for all dependencies
✅ Separate files: selectors, data, assertions
✅ Dynamic URLs based on `TEST_ENV`
✅ Tags: `@smoke`, `@critical`, `@cinesa`, etc.
✅ Allure 2 API: `import { allure }` + `allure.step()`
✅ `allure.epic()` + `allure.feature()` in `beforeEach`
✅ Data-driven parametrization for cinema/format variants
✅ Clean results before each test run
✅ All code in English

## Key Files

| Category       | File                                               | Purpose                                                  |
| -------------- | -------------------------------------------------- | -------------------------------------------------------- |
| **Core**       | `core/webactions/webActions.ts`                    | Playwright API wrapper (ONLY layer accessing Playwright) |
| **Config**     | `config/environments.ts`                           | baseUrl, timeouts, features per env                      |
| **Config**     | `config/urls.ts`                                   | `getCinesaUrls()`, `getUCIUrls()`                        |
| **Config**     | `config/cinemas.config.ts`                         | Cinema parametrization                                   |
| **Fixtures**   | `fixtures/cinesa/playwright.fixtures.ts`           | 30+ Cinesa fixtures                                      |
| **Fixtures**   | `fixtures/uci/playwright.fixtures.ts`              | UCI fixtures                                             |
| **Playwright** | `playwright.config.ts`                             | Test configuration                                       |
| **Allure**     | `allure.config.js`                                 | Report configuration                                     |
| **ADRs**       | `docs/adrs/0009-page-object-architecture-rules.md` | Architecture rules                                       |
| **Reporting**  | `docs/ALLURE_CATEGORIES.md`                        | Allure categories & results behavior                     |
| **Cloudflare** | `docs/CLOUDFLARE_HANDLING.md`                      | Bypass strategies                                        |
| **Style**      | `docs/STYLEGUIDE.md`                               | Coding style guide                                       |

## Path-Specific Instructions

Layer-specific rules load **automatically** when editing matching files:

| File                           | Activates for                           | Key rules                                             |
| ------------------------------ | --------------------------------------- | ----------------------------------------------------- |
| `page-objects.instructions.md` | `pageObjectsManagers/**/*.page.ts`      | WebActions-only, constructor pattern, `allure.step()` |
| `selectors.instructions.md`    | `pageObjectsManagers/**/*.selectors.ts` | Interface + const, `data-testid` priority             |
| `test-specs.instructions.md`   | `tests/**/*.spec.ts`                    | Fixture imports, Allure labels, middot naming, tags   |
| `assertions.instructions.md`   | `tests/**/*.assertions.ts`              | `Page` injection, `allure.step()`, `expect()`         |
| `test-data.instructions.md`    | `tests/**/*.data.ts`                    | Dynamic URLs, `getCinesaConfig()`, typed exports      |
| `webactions.instructions.md`   | `core/webactions/**`                    | Step taxonomy `[NAV]/[ACT]/[WAIT]/[ASSERT]/[DATA]`    |
| `fixtures.instructions.md`     | `fixtures/**/*.ts`                      | DI pattern, context override chain                    |
| `config.instructions.md`       | `config/**`                             | Interfaces, getter functions, multi-market            |
| `uci-platform.instructions.md` | `**/uci/**`                             | UCI-specific: Italian URLs, `getUCIConfig()`          |

## Documentation

Update when making changes:

- `README.md` — Major features
- `docs/adrs/` — Architectural decisions

---

**This framework prioritizes maintainability over convenience.** The strict separation ensures the codebase scales to 500+ tests without becoming unmaintainable.
