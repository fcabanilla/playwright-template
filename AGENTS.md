# AGENTS.md

**Playwright Multi-Platform Test Automation Framework**

This file provides AI coding agents with the specific context, conventions, and commands needed to work effectively with this cinema automation project.

---

## Project Overview

Multi-platform Playwright test automation for cinema chains (Cinesa, UCI) with strict architectural patterns emphasizing maintainability, type safety, and separation of concerns.

**Key Architecture Principles:**
- WebActions is the ONLY layer allowed to call Playwright API
- Page Objects NEVER access `page` directly - only through WebActions
- All selectors live in separate `*.selectors.ts` files
- Fixtures provide dependency injection (20+ fixtures available)
- Multi-environment support (production, preprod, lab) via `TEST_ENV`

**Critical Files:**
- `docs/adrs/0009-page-object-architecture-rules.md` - Architecture rules (MUST READ)
- `.github/copilot-instructions.md` - Complete coding guidelines
- `core/webactions/webActions.ts` - Single Playwright API gateway
- `playwright.config.ts` - Test configuration
- `config/environments.ts` - Environment configs per platform

---

## Setup Commands

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Generate consent storage states (required before tests)
npx playwright test --project=setup
```

---

## Running Tests

### By Platform
```bash
npm run test:cinesa          # Cinesa platform (Spain)
npm run test:uci             # UCI platform (Italy)
```

### By Environment
```bash
TEST_ENV=production npm test  # Production (default)
TEST_ENV=preprod npm test     # Preprod environment
TEST_ENV=lab npm test         # Lab environment
```

### By Component
```bash
npm run test:navbar          # Navbar tests
npm run test:seatpicker      # Seat picker tests (30 tests)
npm run test:movies          # Movies catalog tests
npm run test:bar             # F&B tests
```

### Cloudflare Environments
```bash
# For preprod/lab (with Cloudflare protection)
npm run test:cinesa:cloudflare    # Headed mode, workers=1
npm run test:uci:cloudflare
```

### Quick Smoke Tests
```bash
npm run test:cinesa:smoke     # Run @smoke tagged tests
npm run test:cinesa:critical  # Run @critical tagged tests
npm run test:cinesa:fast      # Run @fast tagged tests
```

---

## Testing Instructions

### Before Running Tests
1. **MUST generate consent states first:**
   ```bash
   npx playwright test --project=setup
   ```
   This creates `state/consented.{env}.{region}.json` files

2. **Check environment configuration:**
   - `config/environments.ts` contains baseUrl and features per environment
   - Default: `TEST_ENV=production`

### Running Single Test
```bash
# Clear old Allure results FIRST (critical - see ADR-0014)
npm run report:clean:results

# Run specific test
npx playwright test tests/cinesa/navbar/navbar.spec.ts --project='Cinesa'

# Run specific line
npx playwright test tests/cinesa/seatPicker/seatPicker.spec.ts:406:3 --project='Cinesa'
```

### Debugging
```bash
npx playwright test --debug              # Step-through debugging
npx playwright test --headed             # Visual mode
npx playwright test --trace on           # Record trace
npx playwright codegen https://cinesa.es # Generate selectors
```

### CI/CD
- Tests run automatically on PR
- Allure reports generated in `.allure/report/`
- Videos/screenshots in `.allure/playwright-artifacts/`

---

## Code Style Guidelines

### Language
**CRITICAL: ALL code MUST be written in English**
- ✅ Test names, descriptions, variables, functions, comments in English
- ❌ NO Spanish in code (except test data representing real content)

### TypeScript Strict Mode
- All files use strict TypeScript
- No `any` types without justification
- Prefer interfaces over types for objects

### Test Naming Convention
**Format:** `Component · Section · Action · Details — Cinema (optional)`

**Examples:**
```typescript
test('Navbar · Visibility · Display all elements', ...)
test('Seat Picker · Complete Purchase · Purchase · Single seat — Oasiz', ...)
test('Films · Catalog · Display movie cards', ...)
```

**Use middot character (·)** - NOT dash or hyphen

### Test Tags (in test names)
```typescript
test('@smoke @critical @navbar @cinesa should display elements', ...)
```

**Common Tags:**
- Priority: `@smoke`, `@critical`, `@fast`, `@medium`
- Type: `@regression`, `@integration`, `@e2e`
- Platform: `@cinesa`, `@uci`
- Component: `@navbar`, `@films`, `@booking`, etc.

### Allure Reporting (Allure 2 API)
```typescript
// ✅ CORRECT - Allure 2 API
import { allure } from 'allure-playwright';

await allure.step('Step description', async () => {
  // Your code here
});

await allure.epic('Cinesa Platform');
await allure.feature('Navbar - Main Navigation');
await allure.story('Display navbar elements');
```

**❌ WRONG - Allure 3 API (not supported):**
```typescript
import * as allure from 'allure-playwright';
await allure.test.step('...', async () => {}); // ❌ Does not exist
```

### Hierarchical Labels (MANDATORY)
All tests MUST include:
```typescript
test.beforeEach(async ({ navbar, cookieBanner }) => {
  await allure.epic('Cinesa Platform');           // Platform level
  await allure.feature('Navbar - Main Navigation'); // Component level
  
  await navbar.navigateToHome();
  await cookieBanner.acceptAllCookies();
});

test('should display elements', async ({ navbar }) => {
  await allure.story('Display navbar elements'); // Test scenario
  await navbar.verifyElements();
});
```

---

## Architecture Rules (CRITICAL)

### 1. Page Objects NEVER Access Playwright API Directly

**✅ CORRECT:**
```typescript
export class NavbarPage {
  constructor(private readonly webActions: WebActions) {} // Only WebActions

  async clickLogo(): Promise<void> {
    await this.webActions.click(this.selectors.logo, 'logo');
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

### 2. Selectors MUST Live in Separate Files

**Structure:**
```
📁 pageObjectsManagers/cinesa/componentName/
├── componentName.page.ts       # Business logic, uses WebActions ONLY
├── componentName.selectors.ts  # ALL CSS/XPath selectors
└── componentName.types.ts      # TypeScript interfaces (optional)

📁 tests/cinesa/componentName/
├── componentName.spec.ts       # Test cases
├── componentName.assertions.ts # Component assertions (with Allure steps)
├── componentName.data.ts       # Test data: URLs, expected values
└── componentName.helpers.ts    # Test utilities (optional)
```

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

### 3. Always Use Fixtures (Dependency Injection)

**✅ CORRECT:**
```typescript
import { test } from '../../../fixtures/cinesa/playwright.fixtures';

test('should work', async ({ navbar, cookieBanner }) => {
  await navbar.navigateToHome();
  await cookieBanner.acceptAllCookies();
});
```

**❌ FORBIDDEN:**
```typescript
test('should work', async ({ page }) => {
  const webActions = new WebActions(page); // ❌ Never instantiate directly
  const navbar = new NavbarPage(webActions); // ❌ Use fixtures instead
});
```

### 4. WebActions Standardized Messages (ADR-0015)

**New standardized format:**
```typescript
// Navigation - just URL
await webActions.navigateTo('https://www.cinesa.es/peliculas');
// Allure: "[NAV] Goto | URL=/peliculas | Env=production"

// Click - pass selector + logical name
await webActions.click(this.selectors.loginButton, 'loginButton');
// Allure: "[ACT] Click | Target=loginButton"

// Fill - auto-masked values
await webActions.fill(this.selectors.email, 'user@test.com', 'emailInput');
// Allure: "[ACT] Fill | Field=emailInput | Value=••••••••••••.com"

// Wait - explicit timeout
await webActions.waitForVisible(this.selectors.modal, 5000, 'modal');
// Allure: "[WAIT] Visible | Target=modal | Timeout=5.0s"
```

**Taxonomy Prefixes:**
- `[NAV]` - Navigation
- `[ACT]` - User actions
- `[WAIT]` - Waiting conditions
- `[ASSERT]` - Verifications
- `[DATA]` - Data operations

---

## File Creation Workflow

### Creating New Component

1. **Create Page Object structure:**
   ```bash
   mkdir -p pageObjectsManagers/cinesa/newComponent
   touch pageObjectsManagers/cinesa/newComponent/newComponent.page.ts
   touch pageObjectsManagers/cinesa/newComponent/newComponent.selectors.ts
   ```

2. **Create Test structure:**
   ```bash
   mkdir -p tests/cinesa/newComponent
   touch tests/cinesa/newComponent/newComponent.spec.ts
   touch tests/cinesa/newComponent/newComponent.assertions.ts
   touch tests/cinesa/newComponent/newComponent.data.ts
   ```

3. **Add to Fixtures:**
   Edit `fixtures/cinesa/playwright.fixtures.ts`:
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

4. **Follow naming conventions:**
   - Files: camelCase (`newComponent.page.ts`)
   - Classes: PascalCase (`NewComponentPage`)
   - Variables: camelCase
   - Test names: Use middot (·) separator

---

## Test Data Management

### Dynamic URLs Based on Environment
```typescript
// In *.data.ts files
import { getCinesaConfig, CinesaEnvironment } from '../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);
const baseUrl = config.baseUrl;

export const componentUrls = {
  base: `${baseUrl}/component`,
  detail: (id: string) => `${baseUrl}/component/${id}`,
};
```

### Parametrized Tests (Avoid Duplication)
```typescript
// Define configurations in *.data.ts
export const AVAILABLE_CINEMAS = [
  {
    name: 'Oasiz',
    selectMethod: 'selectOasizCinema',
    tags: ['@oasiz'],
    availableInEnvironments: ['production', 'lab', 'preprod'],
  },
  // ... more cinemas
];

// Parametrized test loop
for (const cinema of CINEMAS) {
  test(`Full purchase - ${cinema.name}`, 
    { tag: ['@e2e', '@booking', ...cinema.tags] },
    async ({ cinemaPage, seatPicker }) => {
      await cinemaPage[cinema.selectMethod]();
      await seatPicker.selectLastAvailableSeat();
    }
  );
}
```

---

## Allure Reporting

### Generate Reports
```bash
npm run report             # Complete workflow: copy history + generate + open
npm run report:generate    # Generate Allure report from results
npm run report:open        # Open report in browser
npm run report:clean       # Clean all artifacts
npm run report:clean:results  # Clean ONLY results (before new test execution)
```

### CRITICAL: Results Accumulation Behavior

**Allure accumulates results by design.** Always clean before new execution:

```bash
# Step 1: Clear old results (MANDATORY)
npm run report:clean:results

# Step 2: Run test(s)
TEST_ENV=preprod npx playwright test tests/cinesa/seatPicker/seatPicker.spec.ts --project='Cinesa'

# Step 3: Generate report with history preservation
npm run report
```

**Directory Structure:**
- `.allure/results/` - Current execution JSON files (MUST clean before each run)
- `.allure/report/` - Generated HTML report
- `.allure/report/history/` - Trend data (MUST preserve, DO NOT delete)
- `.allure/playwright-artifacts/` - Videos, screenshots, traces

---

## Common Pitfalls to Avoid

❌ **Don't** access `page` directly in Page Objects (use `WebActions` only)
❌ **Don't** use inline selectors (extract to `.selectors.ts` files)
❌ **Don't** hardcode URLs (use `config/urls.ts` and `*.data.ts` files)
❌ **Don't** create assertions in test files (use `*.assertions.ts` with Allure steps)
❌ **Don't** ignore Cloudflare on preprod/lab (use `--workers=1 --headed`)
❌ **Don't** instantiate Page Objects directly (always use fixtures)
❌ **Don't** use `allure.test.step()` - use `allure.step()` (Allure 2 API)
❌ **Don't** run tests without cleaning results first (`npm run report:clean:results`)
❌ **Don't** delete `.allure/report/history/` (needed for TREND graphs)
❌ **Don't** write code in Spanish (test names, variables, comments - ALL in English)
❌ **Don't** duplicate tests for variants (use parametrization)
❌ **Don't** forget Allure labels (`epic`, `feature`, `story`)

✅ **Do** use `WebActions` for ALL Playwright API interactions
✅ **Do** use fixtures for all dependencies
✅ **Do** separate selectors, data, and assertions into dedicated files
✅ **Do** tag tests appropriately (`@smoke`, `@critical`, `@fast`)
✅ **Do** clean Allure results before each test execution
✅ **Do** write ALL code in English
✅ **Do** use data-driven parametrization for test variants
✅ **Do** add Allure hierarchical labels (epic/feature/story)

---

## ESLint & Type Checking

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Fix auto-fixable issues
npm run lint:fix
```

**Key Rules:**
- No unused variables
- Consistent naming (camelCase for variables, PascalCase for classes)
- No console.logs in production code
- All code in English

---

## Commit Conventions

Follow conventional commits:
```bash
feat: Add cinema selection tests
fix: Resolve timeout in seat picker
docs: Update architecture decision record
test: Add loyalty program smoke tests
refactor: Standardize Allure step messages
```

---

## Git Workflow

```bash
# Check status
git status

# Stage changes
git add -A

# Commit with conventional format
git commit -m "feat: add new component tests"

# Push to remote
git push origin fix-lab-tests
```

**Before Committing:**
1. Run `npm run lint`
2. Run `npx tsc --noEmit`
3. Verify tests pass
4. Use conventional commit format

---

## Environment Variables

```bash
# Test environment
TEST_ENV=production|preprod|lab

# Cloudflare handling
FORCE_CLOUDFLARE_HANDLING=true

# Cookie acceptance (debug)
FORCE_ACCEPT_COOKIES=true

# Allure results directory
ALLURE_RESULTS_DIR=.allure/results
```

---

## Key Documentation Files

**Must Read:**
- `.github/copilot-instructions.md` - Complete coding guidelines (primary source)
- `docs/adrs/0009-page-object-architecture-rules.md` - Architecture rules
- `docs/adrs/0014-cookie-consent-persistence-with-storage-state.md` - Cookie handling
- `docs/adrs/0015-standardize-allure-steps-in-webActions.md` - Allure step format

**Reference:**
- `docs/ARCHITECTURE.md` - System architecture
- `docs/STYLEGUIDE.md` - Coding style guide
- `docs/CLOUDFLARE_HANDLING.md` - Cloudflare bypass strategies
- `docs/NPM_SCRIPTS_GUIDE.md` - All available npm commands

**Reporting:**
- `docs/ALLURE_DIRECTORY_STRUCTURE.md` - Directory structure
- `docs/ALLURE_WORKFLOW_CRITICAL.md` - Results accumulation behavior

---

## Multi-Platform Architecture

### Platforms
- **Cinesa:** Spain (`tests/cinesa/`, `pageObjectsManagers/cinesa/`)
- **UCI:** Italy (`tests/uci/`, `pageObjectsManagers/uci/`)

### Configuration
- Environment: `config/environments.ts`
- URLs: `config/urls.ts` (functions: `getCinesaUrls()`, `getUCIUrls()`)
- Test Accounts: `config/testAccounts.ts`
- Cinemas: `config/cinemas.config.ts`

### Fixtures
- Cinesa: `fixtures/cinesa/playwright.fixtures.ts` (20+ fixtures)
- UCI: `fixtures/uci/playwright.fixtures.ts`

---

## Booking Flow Components

Complete booking flow sequence:
1. **Movies** → Select film
2. **Cinemas** → Choose cinema
3. **SeatPicker** → Select seats (30 tests, 100% coverage)
4. **TicketPicker** → Choose ticket types
5. **Bar** → Food & Beverages
6. **PurchaseSummary** → Review order
7. **Payment** → Complete purchase

---

## When in Doubt

1. **Architecture questions:** Check `docs/adrs/0009-page-object-architecture-rules.md`
2. **Test naming:** Use middot (·) separator, English only
3. **Selectors:** Extract to `*.selectors.ts`, never inline
4. **Page Objects:** Only inject `WebActions`, never `page`
5. **Tests:** Always use fixtures, never instantiate POMs directly
6. **Allure:** Use Allure 2 API (`import { allure }`), add epic/feature/story
7. **Reports:** Clean results before each run (`npm run report:clean:results`)

**Primary Reference:** `.github/copilot-instructions.md` (1000+ lines, authoritative source)

---

## Support

- **Primary Documentation:** `.github/copilot-instructions.md`
- **ADRs:** `docs/adrs/` (Architecture Decision Records)
- **Examples:** Check existing tests in `tests/cinesa/` and `tests/uci/`

---

*Last updated: 2025-11-13*
*Compatible with: Codex (OpenAI), GitHub Copilot, Cursor, Aider, Jules (Google), VS Code*
