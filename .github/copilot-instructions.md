# Copilot Instructions - Cinema Multi-Platform Test Automation

## Project Context

This is a **multi-platform Playwright test automation framework** for cinema chains (Cinesa, UCI) with strict architectural patterns. The framework emphasizes maintainability, type safety, and separation of concerns through enforced layer boundaries.

## Critical Architecture Rules (MUST FOLLOW)

### 1. **Page Objects NEVER Access Playwright API Directly**

**✅ CORRECT:**

```typescript
export class NavbarPage {
  constructor(private readonly webActions: WebActions) {} // Only WebActions

  async clickLogo(): Promise<void> {
    await this.webActions.click(this.selectors.logo); // Delegate to WebActions
  }
}
```

**❌ FORBIDDEN:**

```typescript
export class NavbarPage {
  constructor(private readonly page: Page) {} // ❌ Never inject page

  async clickLogo(): Promise<void> {
    await this.page.click('[data-testid="logo"]'); // ❌ Never use page API
  }
}
```

**Rationale:** All Playwright API access goes through `WebActions` (core/webactions/) for consistency, maintainability, and centralized error handling.

**Note:** Some legacy Page Objects still access `page` directly. These need to be refactored to use `WebActions`. See `docs/adrs/0009-page-object-architecture-rules.md`.

### 2. **Selectors MUST Live in Separate `.selectors.ts` Files**

**✅ CORRECT:**

```typescript
// navbar.selectors.ts
export const navbarSelectors = {
  logo: '[data-testid="navbar-logo"]',
  menuButton: '[data-testid="navbar-menu"]',
} as const;

// navbar.page.ts
import { navbarSelectors } from './navbar.selectors';
export class NavbarPage {
  private readonly selectors = navbarSelectors;
}
```

**❌ FORBIDDEN:**

```typescript
// navbar.page.ts
export class NavbarPage {
  async clickLogo() {
    await this.webActions.click('[data-testid="navbar-logo"]'); // ❌ No inline selectors
  }
}
```

### 3. **Complete Component Structure Pattern**

Every component follows this layered structure:

```
📁 pageObjectsManagers/cinesa/componentName/
├── componentName.page.ts       # Business logic, uses WebActions ONLY
├── componentName.selectors.ts  # All CSS/XPath selectors
└── componentName.types.ts      # TypeScript interfaces (optional)

📁 tests/cinesa/componentName/
├── componentName.spec.ts       # Test cases
├── componentName.assertions.ts # Component-specific assertions (with Allure steps)
├── componentName.data.ts       # Test data: URLs, expected values, nav items
└── componentName.helpers.ts    # Test utilities (optional)
```

**Key Locations:**

- **Selectors:** `pageObjectsManagers/[platform]/[component]/[component].selectors.ts`
- **Page Objects:** `pageObjectsManagers/[platform]/[component]/[component].page.ts`
- **Test Data:** `tests/[platform]/[component]/[component].data.ts`
- **Assertions:** `tests/[platform]/[component]/[component].assertions.ts`
- **WebActions:** `core/webactions/webActions.ts` (only layer accessing Playwright API)
- **Fixtures:** `fixtures/[platform]/playwright.fixtures.ts`

## Multi-Platform Architecture

### Platform Separation

- **Cinesa:** `tests/cinesa/`, `pageObjectsManagers/cinesa/`, `fixtures/cinesa/`
- **UCI:** `tests/uci/`, `pageObjectsManagers/uci/`, `fixtures/uci/`

### Environment Configuration

Set environment via `TEST_ENV`:

```bash
TEST_ENV=preprod npm test      # preprod: https://preprod-web.ocgtest.es
TEST_ENV=lab npm test          # lab: https://lab-web.ocgtest.es
TEST_ENV=production npm test   # production: https://www.cinesa.es
```

**Configuration Files:**

- `config/environments.ts` - Environment configs (baseUrl, timeouts, features) for both platforms
- `config/urls.ts` - Centralized URL management with functions:
  - `getCinesaUrls()` - Returns NavigationUrls object for Cinesa
  - `getUCIUrls()` - Returns NavigationUrls object for UCI
  - Dynamic URLs adapt to `TEST_ENV` automatically

**URL Usage Pattern:**

```typescript
// In test data files (*.data.ts)
import { getCinesaConfig } from '../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);
const baseUrl = config.baseUrl;

// Use dynamic URLs
export const internalNavItems: NavItem[] = [
  { selectorKey: 'cines', expectedUrl: `${baseUrl}/cines/` },
  { selectorKey: 'peliculas', expectedUrl: `${baseUrl}/peliculas/` },
];
```

## Fixture System (Dependency Injection)

Tests use custom fixtures for automatic setup:

```typescript
// fixtures/cinesa/playwright.fixtures.ts
export const test = base.extend<{
  navbar: NavbarPage;
  moviePage: MoviePage;
}>({
  navbar: async ({ page }, use) => {
    const webActions = new WebActions(page);
    await use(new NavbarPage(webActions));
  },
  moviePage: async ({ page }, use) => {
    const webActions = new WebActions(page);
    await use(new MoviePage(webActions));
  },
});

// In tests
test('should display navbar', async ({ navbar }) => {
  await navbar.navigateToHome(); // Fixture injected automatically
});
```

**20+ fixtures available** covering all components. Always import from fixtures, never instantiate Page Objects directly.

## Cloudflare Protection Handling

Cloudflare is present on preprod/lab environments. Use specific patterns:

```typescript
// For Cloudflare-protected environments
await webActions.navigateToWithCloudflareHandling(url);

// Commands for Cloudflare
npm run test:cinesa:cloudflare    # Headed mode, workers=1
npm run test:uci:cloudflare
```

See `docs/CLOUDFLARE_HANDLING.md` for bypass strategies. Use `--headed --workers=1` for Cloudflare environments.

## Test Organization Patterns

### Test File Naming

- `*.spec.ts` - Standard tests
- `*.quick.spec.ts` - Fast smoke tests (<2min)
- `*.integration.spec.ts` - Cross-component flows
- `*-cloudflare.spec.ts` - Tests with Cloudflare handling
- `*.assertions.ts` - Component-specific assertions with Allure steps
- `*.data.ts` - Test data (URLs, expected values, configurations)
- `*.helpers.ts` - Reusable test utilities

### Test Tags (Use in test names)

```typescript
// Critical smoke tests
test('@smoke @critical @navbar @cinesa should display all navbar elements', ...);

// Fast tests for quick feedback
test('@fast @navbar @cinesa should click logo', ...);

// By feature area
test('@films @uci @content @medium Verify films catalog', ...);

// By priority
test('@high-priority @regression @booking should complete purchase', ...);
```

**Common Tags:**

- **Priority:** `@smoke`, `@critical`, `@fast`, `@medium`, `@low-priority`
- **Type:** `@regression`, `@integration`, `@e2e`
- **Platform:** `@cinesa`, `@uci`
- **Component:** `@navbar`, `@films`, `@booking`, `@payment`, etc.

**Running by tags:**

```bash
npm run test:uci:smoke      # Run @smoke tests
npm run test:uci:critical   # Run @critical tests
npm run test:uci:fast       # Run @fast tests
npx playwright test --grep "@smoke"     # Custom grep
npx playwright test --grep "@cinesa.*@navbar"  # Multiple tags
```

### Test Structure with Fixtures

```typescript
import { test } from '../../fixtures/cinesa/playwright.fixtures';

test.describe('Navbar Tests', () => {
  test.beforeEach(async ({ navbar, cookieBanner }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
  });

  test('@smoke @navbar should display logo', async ({ navbar }) => {
    await navbar.verifyLogoVisible();
  });
});
```

### Assertions Pattern

```typescript
// Component-specific assertions in *.assertions.ts
export class NavbarAssertions {
  constructor(private readonly page: Page) {}

  async expectNavbarElementsVisible(): Promise<void> {
    await allure.test.step('Verifying navbar elements visibility', async () => {
      await expect(this.page.locator(this.selectors.cines)).toBeVisible();
      // ... more assertions with Allure steps
    });
  }
}

// Use in tests
const assertions = new NavbarAssertions(page);
await assertions.expectNavbarElementsVisible();
```

## Common Workflows

### Running Tests

```bash
# Specific components
npm run test:navbar
npm run test:seatpicker
npm run test:movies

# By platform
npm run test:cinesa
npm run test:uci

# With environment
TEST_ENV=preprod npm run test:cinesa
```

### Generating Reports

```bash
npm run report             # Complete workflow: copy history + generate + open
npm run report:generate    # Generate Allure report from results
npm run report:open        # Open report in browser
npm run report:clean       # Clean all Allure artifacts (results + reports + videos)
npm run report:clean:results  # Clean ONLY results (before new test execution)
```

**Directory Structure:**

- `.allure/results/` - Test execution results (JSON files generated by allure-playwright)
- `.allure/report/` - Generated HTML report (created by allure generate)
- `.allure/playwright-artifacts/` - Videos, screenshots, traces from Playwright

See `docs/ALLURE_DIRECTORY_STRUCTURE.md` for complete documentation.

### ⚠️ CRITICAL: Allure Results Accumulation Behavior

Allure accumulates results by design. According to official documentation:

> "If the directory already exists, the new files will be added to the existing ones, so that a future report will be based on them all."

**Problem:** Running 1 test without cleaning results shows accumulated totals (e.g., 268 old + 1 new = 269 tests).

**Solution: Always clean results before each new test execution**

#### Correct Workflow for Single Test Execution

```bash
# Step 1: Clear old results (MANDATORY before each test run)
npm run report:clean:results

# Step 2: Run your test(s)
TEST_ENV=preprod npx playwright test tests/cinesa/seatPicker/seatPicker.spec.ts:406:3 --project='Cinesa'

# Step 3: Generate report with history preservation
npm run report
```

#### Correct Workflow for Full Test Suite

```bash
# Step 1: Clear old results
npm run report:clean:results

# Step 2: Run complete suite
npm run test:cinesa:preprod

# Step 3: Generate report
npm run report
```

#### Understanding the Two Directories

**`.allure/results/` (Current Execution Data)**

- Contains JSON files from current test run
- **MUST be cleared** before each new execution to avoid accumulation
- Command: `npm run report:clean:results` (runs `rm -rf .allure/results/*`)

**`.allure/report/history/` (Historical Trend Data)**

- Contains trend data for TREND graph (last 20 executions)
- **MUST be preserved** and copied before report generation
- Command: `npm run report:copy-history` (copies `.allure/report/history/` → `.allure/results/history/`)

#### NPM Script Order (CRITICAL)

**✅ CORRECT ORDER (Current Configuration):**

```json
"report": "npm run report:copy-history && npm run report:generate && npm run report:open"
```

**❌ WRONG ORDER (Previous Bug):**

```json
"report": "npm run report:clean && npm run report:copy-history && ..."  // ❌ Deletes history before copy
```

#### TREND Graph Behavior

- Each column in TREND graph = one complete test execution
- NOT cumulative totals
- Shows test count evolution across runs
- Example:
  - Column 1: Execution with 269 tests
  - Column 2: Execution with 1 test (focused debugging)
  - This is expected behavior, not a bug

#### Common Mistake: Wrong Script Used

**❌ WRONG - Old script definition:**

```json
"report:clean:results": "rm -rf .allure/playwright-artifacts/*"  // ❌ Deletes videos, NOT results
```

**✅ CORRECT - Fixed script:**

```json
"report:clean:results": "rm -rf .allure/results/*"  // ✅ Deletes JSON results
```

### Debugging

```bash
npx playwright test --debug              # Step-through debugging
npx playwright test --headed             # Visual mode
npx playwright test --trace on           # Record trace
npx playwright codegen https://cinesa.es # Generate selectors
```

## Component-Specific Conventions

### Booking Flow Components

The complete booking flow follows this sequence:

1. **Movies** → Select film
2. **Cinemas** → Choose cinema
3. **SeatPicker** → Select seats (30 tests, 100% coverage)
4. **TicketPicker** → Choose ticket types
5. **Bar** → Food & Beverages
6. **PurchaseSummary** → Review order
7. **Payment** → Complete purchase

Each component has implicit coverage through full booking tests even without explicit tests.

### Session State Management

Use storage state for authenticated sessions:

```typescript
// playwright.config.ts
storageState: process.env.TEST_ENV === 'preprod'
  ? 'loggedInState.preprod.json'
  : undefined;
```

## Code Quality Standards

### Allure 2 Reporting Integration

This project uses **Allure 2** (`allure-playwright@2.15.1`) for test reporting.

**Correct API Usage:**

```typescript
// ✅ CORRECT - Allure 2 API
import { allure } from 'allure-playwright';

await allure.step('Step description', async () => {
  // Your code here
});

await allure.parameter('paramName', 'paramValue');
await allure.attachment('name', data, { contentType: 'image/png' });
```

**Common Mistakes:**

```typescript
// ❌ WRONG - Allure 3 API (not supported)
import * as allure from 'allure-playwright';
await allure.test.step('...', async () => {}); // Property 'test' does not exist

// ❌ WRONG - Old import style
import * as allure from 'allure-playwright'; // Use named import instead
```

**Where to Use Allure Steps:**

- **Page Objects:** Can use `allure.step()` for high-level business actions
- **Assertions (`*.assertions.ts`):** Should use `allure.step()` for validation steps
- **WebActions (optional):** Some methods support custom step messages via parameters
- **Tests:** Can use `allure.step()` for test-level flow steps

**Example - Page Object with Allure 2:**

```typescript
import { allure } from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';

export class NavbarPage {
  constructor(private readonly webActions: WebActions) {}

  async navigateToMovies(): Promise<void> {
    await allure.step('Navigate to Movies page', async () => {
      await this.webActions.click(this.selectors.peliculas);
    });
  }
}
```

**Example - WebActions with Optional Steps:**

```typescript
// WebActions supports optional step messages
await webActions.click(selector, 'Click on movie card'); // Creates Allure step
await webActions.navigateTo(url, 'Navigate to home'); // Creates Allure step
```

### TypeScript Strict Mode

- All files use strict TypeScript
- No `any` types without justification
- Prefer interfaces over types for objects

### Language and Naming Standards

**CRITICAL: All code MUST be written in English**

**✅ CORRECT:**

```typescript
// Test names and descriptions in English
test('Should display navbar elements correctly', async ({ navbar }) => {
  await allure.step('Verify logo is visible', async () => {
    // Implementation
  });
});

// Variables, functions, comments in English
const selectedSeats = await seatPicker.selectLastAvailableSeat();
// Check if confirmation button is enabled
await assertConfirmButtonEnabled(page);
```

**❌ FORBIDDEN:**

```typescript
// ❌ Test names in Spanish
test('Debe mostrar elementos de la barra de navegación', async ({ navbar }) => {
  // ❌ Spanish step descriptions
  await allure.step('Verificar que el logo es visible', async () => {
    // Implementation
  });
});

// ❌ Spanish variable names
const butacasSeleccionadas = await seatPicker.selectLastAvailableSeat();
// ❌ Spanish comments
// Verificar si el botón de confirmación está habilitado
await assertConfirmButtonEnabled(page);
```

**Exceptions (Spanish allowed):**

- Allure report labels for business visibility (via `allure.parameter()`)
- Test data representing real Spanish content (e.g., cinema names, movie titles)
- Documentation explicitly targeting Spanish-speaking stakeholders

**Rationale:**

- **Searchability:** English enables global search across codebase
- **Telemetry:** CI/CD systems parse English keywords better
- **Maintainability:** International teams can contribute
- **Industry Standard:** Aligns with open-source best practices

### Test Parametrization and Data-Driven Testing

**Avoid test duplication by using data-driven patterns**

**✅ CORRECT - Parametrized Tests:**

```typescript
// Define cinema configurations in *.data.ts
export const AVAILABLE_CINEMAS = [
  {
    name: 'Oasiz',
    selectMethod: 'selectOasizCinema',
    tags: ['@oasiz'],
    availableInEnvironments: ['production', 'lab', 'preprod'],
  },
  {
    name: 'Grancasa',
    selectMethod: 'selectGrancasaCinema',
    tags: ['@grancasa'],
    availableInEnvironments: ['production', 'lab'], // Not in preprod
  },
];

// Get cinemas for current environment
const CINEMAS = getCinemasForEnvironment();

// Parametrized test loop
for (const cinema of CINEMAS) {
  test(
    `Full purchase - ${cinema.name}`,
    {
      tag: ['@e2e', '@booking', ...cinema.tags],
    },
    async ({ cinemaPage, seatPicker }) => {
      await cinemaPage[cinema.selectMethod]();
      await seatPicker.selectLastAvailableSeat();
    }
  );
}
```

**❌ FORBIDDEN - Duplicated Tests:**

```typescript
// ❌ Copy-pasted test for each cinema
test('Full purchase - Oasiz', async ({ cinema, seatPicker }) => {
  await cinema.selectOasizCinema();
  await seatPicker.selectLastAvailableSeat();
});

test('Full purchase - Grancasa', async ({ cinema, seatPicker }) => {
  await cinema.selectGrancasaCinema();
  await seatPicker.selectLastAvailableSeat();
});
```

**Benefits:**

- **Less Maintenance:** Add new cinema by adding one configuration object
- **Consistency:** Same test logic applied uniformly across variants
- **Environment Awareness:** Tests only run for available cinemas in each environment
- **Readability:** Test intent separated from cinema configurations

**When to Parametrize:**

- Multiple cinemas with same test scenarios
- Multiple formats (Normal, D-BOX, 4DX, IMAX) executing same validations
- Multiple promo codes tested with same flow
- Any scenario where logic is identical but data varies

**Environment-Aware Cinema Configuration:**

```typescript
// In *.data.ts file
export function getCinemasForEnvironment(env?: string) {
  const currentEnv = env || process.env.TEST_ENV || 'production';
  return AVAILABLE_CINEMAS.filter((cinema) =>
    cinema.availableInEnvironments.includes(currentEnv)
  );
}

// Usage in tests
const CINEMAS = getCinemasForEnvironment();
// preprod: returns only [Oasiz]
// lab/production: returns [Oasiz, Grancasa]
```

### ESLint Configuration

Run `npm run lint` before commits. Key rules:

- No unused variables
- Consistent naming (camelCase for variables, PascalCase for classes)
- No console.logs in production code
- All code in English (enforced via review, not automated)

### Commit Conventions

Follow conventional commits:

```
feat: Add cinema selection tests
fix: Resolve timeout in seat picker
docs: Update architecture decision record
test: Add loyalty program smoke tests
```

## Common Pitfalls to Avoid

❌ **Don't** access `page` directly in Page Objects (use `WebActions` only)
❌ **Don't** use inline selectors (extract to `.selectors.ts` files)
❌ **Don't** hardcode URLs (use `config/urls.ts` and `*.data.ts` files)
❌ **Don't** create assertions in test files (use `*.assertions.ts` with Allure steps)
❌ **Don't** ignore Cloudflare on preprod/lab environments
❌ **Don't** run parallel tests on Cloudflare (`--workers=1` required)
❌ **Don't** forget to add test tags (@smoke, @critical, @fast, @platform)
❌ **Don't** skip fixture registration (add new Page Objects to fixtures)
❌ **Don't** instantiate Page Objects directly (always use fixtures)
❌ **Don't** use `allure.test.step()` (Allure 3 API) - use `allure.step()` (Allure 2 API)
❌ **Don't** use `import * as allure` - use `import { allure }` instead
❌ **Don't** run tests without cleaning results first (`npm run report:clean:results`)
❌ **Don't** delete `.allure/report/history/` (needed for TREND graphs)
❌ **Don't** write test names, descriptions, or comments in Spanish
❌ **Don't** duplicate tests for different cinemas/variants (use parametrization)
❌ **Don't** hardcode test data in spec files (extract to `*.testData.ts`)

✅ **Do** use `WebActions` for ALL Playwright API interactions in Page Objects
✅ **Do** use fixtures for all component dependencies
✅ **Do** separate selectors (`*.selectors.ts`), data (`*.data.ts`), and assertions (`*.assertions.ts`)
✅ **Do** inject `page` in assertions only (for test-level validations)
✅ **Do** add Allure steps in assertions for better reporting
✅ **Do** make URLs dynamic based on `TEST_ENV` in `*.data.ts` files
✅ **Do** tag tests appropriately for filtering and reporting
✅ **Do** check environment with `process.env.TEST_ENV` for conditional logic
✅ **Do** handle cookie banners in `beforeEach` hooks
✅ **Do** use Allure 2 API: `import { allure } from 'allure-playwright'` and `allure.step()`
✅ **Do** clean results before each test execution: `npm run report:clean:results`
✅ **Do** write ALL code in English (test names, variables, comments, functions)
✅ **Do** use data-driven parametrization for test variants (cinemas, formats, etc.)
✅ **Do** store test data in separate `*.testData.ts` files for reusability

## Key Files Reference

### Architecture & Patterns

- **Architecture:** `docs/ARCHITECTURE.md`, `docs/adrs/0009-page-object-architecture-rules.md`
- **Style Guide:** `docs/STYLEGUIDE.md`

### Core Framework

- **WebActions:** `core/webactions/webActions.ts` (Playwright API wrapper)
- **Cloudflare Handler:** `core/webactions/cloudflareHandler.ts`
- **CORS Handler:** `core/webactions/corsHandler.ts`

### Configuration

- **Playwright Config:** `playwright.config.ts`
- **Environments:** `config/environments.ts` (baseUrl, timeouts, features per environment)
- **URLs:** `config/urls.ts` (centralized URL functions: `getCinesaUrls()`, `getUCIUrls()`)

### Fixtures (Dependency Injection)

- **Cinesa:** `fixtures/cinesa/playwright.fixtures.ts` (20+ fixtures)
- **UCI:** `fixtures/uci/playwright.fixtures.ts`

### Component Structure (Example: Navbar)

- **Page Object:** `pageObjectsManagers/cinesa/navbar/navbar.page.ts`
- **Selectors:** `pageObjectsManagers/cinesa/navbar/navbar.selectors.ts`
- **Tests:** `tests/cinesa/navbar/navbar.spec.ts`
- **Assertions:** `tests/cinesa/navbar/navbar.assertions.ts`
- **Test Data:** `tests/cinesa/navbar/navbar.data.ts`

### Reporting

- **Allure Config:** `allure.config.js`
- **Results Directory:** `.allure/results/` (configured via `ALLURE_RESULTS_DIR` env var)
- **Reports Directory:** `.allure/report/`
- **Artifacts:** `.allure/playwright-artifacts/` (videos, screenshots, traces)
- **Documentation:**
  - `docs/ALLURE_DIRECTORY_STRUCTURE.md` - Complete directory structure guide
  - `docs/ALLURE_WORKFLOW_CRITICAL.md` - **CRITICAL: Results accumulation behavior and workflow**

## When Creating New Components

### 1. Create Page Object Structure

```
pageObjectsManagers/cinesa/newComponent/
├── newComponent.page.ts        # Business logic
├── newComponent.selectors.ts   # All selectors
└── newComponent.types.ts       # Interfaces (optional)
```

**Example - newComponent.selectors.ts:**

```typescript
export interface NewComponentSelectors {
  container: string;
  actionButton: string;
  title: string;
}

export const newComponentSelectors: NewComponentSelectors = {
  container: '[data-testid="new-component"]',
  actionButton: '[data-testid="action-btn"]',
  title: '.component-title',
} as const;
```

**Example - newComponent.page.ts:**

```typescript
import { WebActions } from '../../../core/webactions/webActions';
import { newComponentSelectors } from './newComponent.selectors';

export class NewComponentPage {
  constructor(private readonly webActions: WebActions) {}
  private readonly selectors = newComponentSelectors;

  async performAction(): Promise<void> {
    await this.webActions.click(this.selectors.actionButton);
  }

  async getTitle(): Promise<string> {
    return await this.webActions.getText(this.selectors.title);
  }
}
```

### 2. Create Test Structure

```
tests/cinesa/newComponent/
├── newComponent.spec.ts        # Test cases
├── newComponent.assertions.ts  # Assertions with Allure steps
├── newComponent.data.ts        # Test data and URLs
└── newComponent.helpers.ts     # Utilities (optional)
```

**Example - newComponent.data.ts:**

```typescript
import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);

export const componentUrls = {
  base: `${config.baseUrl}/new-component`,
  detail: (id: string) => `${config.baseUrl}/new-component/${id}`,
};

export const expectedValues = {
  title: 'Component Title',
  buttonText: 'Click Me',
};
```

**Example - newComponent.assertions.ts:**

```typescript
import { Page, expect } from '@playwright/test';
import * as allure from 'allure-playwright';

export class NewComponentAssertions {
  constructor(private readonly page: Page) {}

  async expectComponentVisible(): Promise<void> {
    await allure.test.step('Verify component is visible', async () => {
      await expect(
        this.page.locator('[data-testid="new-component"]')
      ).toBeVisible();
    });
  }
}
```

### 3. Add to Fixtures

Update `fixtures/cinesa/playwright.fixtures.ts`:

```typescript
import { NewComponentPage } from '../../pageObjectsManagers/cinesa/newComponent/newComponent.page';

type CustomFixtures = {
  // ... existing fixtures
  newComponent: NewComponentPage;
};

export const test = base.extend<CustomFixtures>({
  // ... existing fixtures
  newComponent: async ({ page }, use) => {
    const webActions = new WebActions(page);
    await use(new NewComponentPage(webActions));
  },
});
```

### 4. Write Tests

```typescript
import { test } from '../../../fixtures/cinesa/playwright.fixtures';

test.describe('New Component Tests', () => {
  test('@smoke @critical @newComponent should display component', async ({
    newComponent,
    cookieBanner,
  }) => {
    await cookieBanner.acceptAllCookies();
    await newComponent.performAction();
  });
});
```

## Documentation

When code changes require documentation updates, also update:

- `README.md` - If adding major features
- `docs/adrs/` - If making architectural decisions
- `TEST_COVERAGE_REPORT_OPTIMISTIC.md` - If adding new test coverage

---

**Remember:** This framework prioritizes **maintainability over convenience**. The strict separation ensures the codebase scales to 500+ tests without becoming unmaintainable.
