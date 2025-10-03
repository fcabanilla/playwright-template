# 🎨 Style Guide - Cinema Multi-Platform Test Automation Framework

This guide defines code conventions, style, and best practices to maintain consistency and quality throughout the automation framework.

## 📋 Table of Contents

- [General Principles](#-general-principles)
- [Naming Conventions](#%EF%B8%8F-naming-conventions)
- [Layer Structure](#%EF%B8%8F-layer-structure)
- [TypeScript Guidelines](#-typescript-guidelines)
- [Page Objects Pattern](#-page-objects-pattern)
- [Test Organization](#-test-organization)
- [Documentation (JSDoc)](#-documentation-jsdoc)
- [Logging and Debugging](#-logging-and-debugging)
- [Testing Best Practices](#-testing-best-practices)
- [Repository Examples](#-repository-examples)

## 🎯 General Principles

### Clarity over Brevity

```typescript
// ✅ Good: Clear and descriptive
async function selectMovieAndProceedToSeatSelection(
  movieTitle: string
): Promise<void>;

// ❌ Bad: Too brief, unclear
async function selMov(title: string): Promise<void>;
```

### Consistency in Patterns

- **Same pattern** for similar components
- **Same structure** for files and directories
- **Same conventions** for naming throughout the project

### Maintainability

- **Clear separation** of responsibilities
- **Reuse** of common components
- **Clear and updated** documentation

## 🏷️ Naming Conventions

### Files and Directories

```text
# ✅ Correct file structure
pageObjectsManagers/
├── cinesa/
│   ├── navbar/
│   │   ├── navbar.page.ts          # Main Page Object
│   │   ├── navbar.selectors.ts     # CSS/XPath selectors
│   │   └── navbar.types.ts         # Specific types
│   └── movies/
│       ├── movies.page.ts
│       ├── movies.selectors.ts
│       └── movies.types.ts

tests/
├── cinesa/
│   ├── navbar/
│   │   ├── navbar.spec.ts          # Main tests
│   │   ├── navbar.data.ts          # Test data
│   │   └── navbar.assertions.ts    # Specific assertions
```

### Naming Conventions

| Type            | Convention       | Example                                     | Description               |
| --------------- | ---------------- | ------------------------------------------- | ------------------------- |
| **Classes**     | PascalCase       | `NavbarPage`, `MovieSelectors`              | Main components           |
| **Methods**     | camelCase        | `selectMovie()`, `verifyNavigation()`       | Actions and verifications |
| **Variables**   | camelCase        | `movieTitle`, `seatNumber`                  | Local variables           |
| **Constants**   | UPPER_SNAKE_CASE | `DEFAULT_TIMEOUT`, `BASE_URL`               | Constant values           |
| **Interfaces**  | PascalCase + I   | `IMovieData`, `INavbarSelectors`            | Type contracts            |
| **Enums**       | PascalCase       | `TestEnvironment`, `CinemaChain`            | Enumerations              |
| **Files**       | kebab-case       | `navbar.page.ts`, `movie-selection.spec.ts` | Project files             |
| **Directories** | kebab-case       | `seat-picker/`, `purchase-summary/`         | Project folders           |

### Specific Naming by Layer

#### Page Objects

```typescript
// ✅ Correct naming for Page Objects
export class NavbarPage {
  // Action methods
  async clickLogo(): Promise<void>;
  async navigateToMovies(): Promise<void>;
  async selectCinemaLocation(): Promise<void>;

  // Verification methods
  async verifyLogoIsVisible(): Promise<void>;
  async verifyNavigationItems(): Promise<void>;

  // Data retrieval methods
  async getNavigationItemsText(): Promise<string[]>;
  async getCurrentActiveSection(): Promise<string>;
}
```

#### Test Cases

```typescript
// ✅ Descriptive naming for tests
test.describe('Cinesa Navbar Navigation', () => {
  test('should display logo and navigate to home when clicked', async () => {
    // Test implementation
  });

  test('should highlight active navigation section', async () => {
    // Test implementation
  });

  test('should open mobile menu on small screens', async () => {
    // Test implementation
  });
});
```

## 🏗️ Layer Structure

### Layer Architecture

```text
📁 Test Layer (tests/)
    ├── *.spec.ts              # Test cases
    ├── *.data.ts              # Test data
    └── *.assertions.ts        # Custom assertions

📁 Page Object Layer (pageObjectsManagers/)
    ├── *.page.ts              # Page interactions
    ├── *.selectors.ts         # CSS/XPath selectors
    └── *.types.ts             # Type definitions

📁 Core Layer (core/)
    ├── webactions/            # Browser interactions
    ├── assertions/            # Reusable assertions
    ├── base/                  # Base classes
    └── types/                 # Global types

📁 Configuration Layer (config/)
    ├── environments.ts        # Environment configs
    └── urls.ts               # URL mappings

📁 Fixtures Layer (fixtures/)
    └── *.fixtures.ts         # Dependency injection
```

### Responsibilities by Layer

#### Test Layer - `tests/`

- **Responsibility**: Test orchestration and behavior validation
- **Should not**: Contain UI logic or direct selectors

```typescript
// ✅ Correct: Test focused on behavior
test('should complete movie booking flow', async ({
  moviePage,
  seatPage,
  paymentPage,
}) => {
  await moviePage.selectMovie('Avengers: Endgame');
  await seatPage.selectSeats(2);
  await paymentPage.completePayment('credit-card');
  await expect(paymentPage.confirmationMessage).toBeVisible();
});

// ❌ Incorrect: Test with UI logic
test('should complete booking', async ({ page }) => {
  await page.click('.movie-card[data-title="Avengers"]');
  await page.waitForSelector('.seat-map');
  // Too much UI logic in test
});
```

#### Page Object Layer - `pageObjectsManagers/`

- **Responsibility**: UI abstraction and interaction encapsulation
- **Should not**: Contain testing logic or assertions

```typescript
// ✅ Correct: Well encapsulated Page Object
export class MoviePage {
  constructor(private page: Page) {}

  private selectors = {
    movieCard: '[data-testid="movie-card"]',
    movieTitle: '.movie-title',
    bookButton: '.book-now-button',
  };

  async selectMovie(title: string): Promise<void> {
    const movieCard = this.page
      .locator(this.selectors.movieCard)
      .filter({ hasText: title });
    await movieCard.click();
  }
}
```

#### Core Layer - `core/`

- **Responsibility**: Reusable base functionalities
- **Should not**: Contain platform-specific logic

```typescript
// ✅ Correct: Generic reusable WebAction
export class WebActions {
  async clickWithOverlayHandling(selector: string): Promise<void> {
    // Generic logic for handling overlays
    await this.handleOverlays();
    await this.page.locator(selector).click();
  }
}
```

## 📝 TypeScript Guidelines

### Strict Types

```typescript
// ✅ Explicit and strict types
interface MovieSelectors {
  readonly movieCard: string;
  readonly movieTitle: string;
  readonly bookButton: string;
}

interface MovieData {
  title: string;
  genre: string;
  duration: number;
  rating?: number; // Optional with ?
}

// ❌ Weak types
const selectors: any = {
  movieCard: '[data-testid="movie"]',
};
```

### Interfaces vs Types

```typescript
// ✅ Interfaces for extensible contracts
interface BasePageSelectors {
  header: string;
  footer: string;
}

interface NavbarSelectors extends BasePageSelectors {
  logo: string;
  menuItems: string;
}

// ✅ Types for unions and computations
type Environment = 'production' | 'staging' | 'development';
type CinemaChain = 'cinesa' | 'uci';
type TestTag = '@smoke' | '@critical' | '@fast';
```

### Generics for Reusability

```typescript
// ✅ Generic Page Object
abstract class BasePage<TSelectors> {
  constructor(
    protected page: Page,
    protected selectors: TSelectors
  ) {}

  abstract navigate(): Promise<void>;
}

class MoviePage extends BasePage<MovieSelectors> {
  async navigate(): Promise<void> {
    await this.page.goto('/movies');
  }
}
```

## 🎭 Page Objects Pattern

### Standard Structure

```typescript
// ✅ Complete Page Object structure
export class NavbarPage {
  // 1. Injected dependencies
  constructor(private page: Page) {}

  // 2. Private and readonly selectors
  private readonly selectors = {
    logo: '[data-testid="navbar-logo"]',
    menuItems: '.navbar-menu-item',
    loginButton: '[data-testid="login-button"]',
  } as const;

  // 3. Navigation methods
  async navigate(): Promise<void> {
    await this.page.goto('/');
  }

  // 4. Action methods
  async clickLogo(): Promise<void> {
    await this.page.locator(this.selectors.logo).click();
  }

  async clickMenuItem(itemText: string): Promise<void> {
    await this.page
      .locator(this.selectors.menuItems)
      .filter({ hasText: itemText })
      .click();
  }

  // 5. Verification methods
  async verifyLogoIsVisible(): Promise<void> {
    await expect(this.page.locator(this.selectors.logo)).toBeVisible();
  }

  // 6. Data retrieval methods
  async getMenuItemsText(): Promise<string[]> {
    return await this.page.locator(this.selectors.menuItems).allTextContents();
  }
}
```

### Selector Separation

```typescript
// ✅ Selectors in separate file for complex components
// navbar.selectors.ts
export const NavbarSelectors = {
  container: '[data-testid="navbar"]',
  logo: '[data-testid="navbar-logo"]',
  menuItems: {
    movies: '[data-nav="movies"]',
    cinemas: '[data-nav="cinemas"]',
    promotions: '[data-nav="promotions"]',
  },
  userActions: {
    login: '[data-testid="login-button"]',
    signup: '[data-testid="signup-button"]',
    profile: '[data-testid="user-profile"]',
  },
} as const;

// navbar.page.ts
import { NavbarSelectors } from './navbar.selectors';

export class NavbarPage {
  constructor(private page: Page) {}

  async clickMoviesSection(): Promise<void> {
    await this.page.locator(NavbarSelectors.menuItems.movies).click();
  }
}
```

## 🧪 Test Organization

### Test Suite Structure

```typescript
// ✅ Clear test suite organization
test.describe('Cinesa Navbar Component', () => {
  test.beforeEach(async ({ page, navbarPage }) => {
    await navbarPage.navigate();
  });

  test.describe('Visual Elements', () => {
    test('should display logo correctly', async ({ navbarPage }) => {
      await navbarPage.verifyLogoIsVisible();
    });

    test('should display all navigation items', async ({ navbarPage }) => {
      await navbarPage.verifyAllNavigationItemsVisible();
    });
  });

  test.describe('Navigation Functionality', () => {
    test('should navigate to movies section', async ({
      navbarPage,
      moviePage,
    }) => {
      await navbarPage.clickMoviesSection();
      await moviePage.verifyPageLoaded();
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should show mobile menu on small screens', async ({
      page,
      navbarPage,
    }) => {
      await page.setViewportSize({ width: 480, height: 800 });
      await navbarPage.verifyMobileMenuVisible();
    });
  });
});
```

### Test Data Management

```typescript
// ✅ Organized and typed test data
// navbar.data.ts
export const NavbarTestData = {
  navigationItems: [
    { name: 'Movies', url: '/movies', testId: 'nav-movies' },
    { name: 'Cinemas', url: '/cinemas', testId: 'nav-cinemas' },
    { name: 'Promotions', url: '/promotions', testId: 'nav-promotions' },
  ],

  userActions: {
    login: { text: 'Sign In', testId: 'login-button' },
    signup: { text: 'Sign Up', testId: 'signup-button' },
  },

  expectedUrls: {
    home: 'https://www.cinesa.es/',
    movies: 'https://www.cinesa.es/cartelera',
    cinemas: 'https://www.cinesa.es/cines',
  },
} as const;

// Usage in tests
test('should navigate to all main sections', async ({ navbarPage }) => {
  for (const item of NavbarTestData.navigationItems) {
    await navbarPage.clickNavigationItem(item.name);
    await expect(page).toHaveURL(item.url);
    await navbarPage.navigate(); // Return to home
  }
});
```

## 📚 Documentation (JSDoc)

### Page Objects Documentation

````typescript
/**
 * Manages interactions with the Cinesa navbar component.
 * Handles navigation, user actions, and responsive behavior.
 *
 * @example
 * ```typescript
 * const navbar = new NavbarPage(page);
 * await navbar.navigate();
 * await navbar.clickMoviesSection();
 * ```
 *
 * @since 1.0.0
 * @author Cinema Automation Team
 */
export class NavbarPage {
  /**
   * Creates a new NavbarPage instance.
   *
   * @param page - Playwright Page object for browser interactions
   */
  constructor(private page: Page) {}

  /**
   * Navigates to a specific section using the navbar.
   *
   * @param sectionName - Name of the section to navigate to
   * @throws {Error} When section is not found or navigation fails
   *
   * @example
   * ```typescript
   * await navbar.navigateToSection('Movies');
   * ```
   */
  async navigateToSection(sectionName: string): Promise<void> {
    // Implementation
  }
}
````

### Test Cases Documentation

```typescript
/**
 * @suite Cinesa Navbar Navigation
 * @description Tests for navbar component functionality across different scenarios
 * @owner @fcabanilla
 * @priority high
 * @tags @smoke @navigation @critical
 */
test.describe('Cinesa Navbar Navigation', () => {
  /**
   * @test Logo Navigation
   * @description Verifies that clicking the logo returns user to home page
   * @severity critical
   * @story Navigate to home via logo
   */
  test('should navigate to home when logo is clicked', async ({
    navbarPage,
  }) => {
    // Test implementation
  });
});
```

## 🔍 Logging and Debugging

### Logging Levels

```typescript
// ✅ Structured logging with levels
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

export class Logger {
  static info(message: string, context?: any): void {
    console.log(
      `[INFO] ${new Date().toISOString()} - ${message}`,
      context || ''
    );
  }

  static error(message: string, error?: Error): void {
    console.error(
      `[ERROR] ${new Date().toISOString()} - ${message}`,
      error || ''
    );
  }

  static debug(message: string, data?: any): void {
    if (process.env.DEBUG) {
      console.log(
        `[DEBUG] ${new Date().toISOString()} - ${message}`,
        data || ''
      );
    }
  }
}

// Usage in Page Objects
export class MoviePage {
  async selectMovie(title: string): Promise<void> {
    Logger.info(`Selecting movie: ${title}`);

    try {
      await this.page
        .locator(this.selectors.movieCard)
        .filter({ hasText: title })
        .click();

      Logger.info(`Successfully selected movie: ${title}`);
    } catch (error) {
      Logger.error(`Failed to select movie: ${title}`, error as Error);
      throw error;
    }
  }
}
```

### Debug Helpers

```typescript
// ✅ Helpers for debugging
export class DebugHelpers {
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({
      path: `debug-screenshots/${name}-${timestamp}.png`,
      fullPage: true,
    });
  }

  static async logPageInfo(page: Page): Promise<void> {
    const title = await page.title();
    const url = page.url();
    Logger.debug('Page Information', { title, url });
  }

  static async waitWithLog(
    page: Page,
    selector: string,
    timeout = 30000
  ): Promise<void> {
    Logger.debug(`Waiting for element: ${selector}`);
    await page.locator(selector).waitFor({ timeout });
    Logger.debug(`Element found: ${selector}`);
  }
}
```

## 🧪 Testing Best Practices

### Testing Pyramid

```typescript
// ✅ Unit Tests - Fast and specific tests
test.describe('MoviePage Unit Tests', () => {
  test('should format movie duration correctly', () => {
    const moviePage = new MoviePage(mockPage);
    expect(moviePage.formatDuration(120)).toBe('2h 0m');
  });
});

// ✅ Integration Tests - Component interactions
test.describe('Movie Selection Integration', () => {
  test('should select movie and proceed to seat selection', async ({
    moviePage,
    seatPage,
  }) => {
    await moviePage.selectMovie('Avengers');
    await seatPage.verifyPageLoaded();
  });
});

// ✅ E2E Tests - Complete user flows
test.describe('Complete Booking Flow', () => {
  test('should complete full booking journey', async ({
    moviePage,
    seatPage,
    paymentPage,
    confirmationPage,
  }) => {
    await moviePage.selectMovie('Avengers');
    await seatPage.selectSeats(2);
    await paymentPage.completePayment();
    await confirmationPage.verifyBookingSuccess();
  });
});
```

### Test Fixtures and Setup

```typescript
// ✅ Well-organized fixtures
// cinesa.fixtures.ts
export const test = base.extend<{
  navbarPage: NavbarPage;
  moviePage: MoviePage;
  seatPage: SeatPage;
  testData: TestDataManager;
}>({
  navbarPage: async ({ page }, use) => {
    const navbarPage = new NavbarPage(page);
    await use(navbarPage);
  },

  moviePage: async ({ page }, use) => {
    const moviePage = new MoviePage(page);
    await use(moviePage);
  },

  testData: async ({}, use) => {
    const testData = new TestDataManager();
    await testData.initialize();
    await use(testData);
    await testData.cleanup();
  },
});
```

### Coverage and Metrics

```typescript
// ✅ Tests with metrics and tags
test('should load movie page within performance threshold', async ({
  page,
  moviePage,
}) => {
  const startTime = performance.now();

  await moviePage.navigate();
  await moviePage.waitForMoviesLoaded();

  const loadTime = performance.now() - startTime;

  // Performance assertion
  expect(loadTime).toBeLessThan(3000); // 3 seconds

  // Allure reporting
  await allure.attachment('Load Time', `${loadTime}ms`, 'text/plain');
});
```

## 🎨 Repository Examples

### Example 1: Well-Structured Page Object

```typescript
// Extracted from: pageObjectsManagers/cinesa/navbar/navbar.page.ts
export class NavbarPage {
  constructor(private page: Page) {}

  private readonly selectors = {
    logo: '[data-testid="cinesa-logo"]',
    menuItems: '.navbar-menu .menu-item',
    loginButton: '.user-actions .login-btn',
  } as const;

  async navigate(): Promise<void> {
    await this.page.goto('/');
  }

  async clickLogo(): Promise<void> {
    await this.page.locator(this.selectors.logo).click();
  }

  async verifyLogoIsVisible(): Promise<void> {
    await expect(this.page.locator(this.selectors.logo)).toBeVisible();
  }

  async getMenuItemsText(): Promise<string[]> {
    return await this.page.locator(this.selectors.menuItems).allTextContents();
  }
}
```

### Example 2: Well-Documented Test Case

```typescript
// Extracted from: tests/cinesa/navbar/navbar.spec.ts
import { test, expect } from '../../fixtures/cinesa/playwright.fixtures';

test.describe('Cinesa Navbar Component', () => {
  test.beforeEach(async ({ navbarPage }) => {
    await navbarPage.navigate();
  });

  test('should display logo and navigate to home when clicked', async ({
    page,
    navbarPage,
  }) => {
    // Verify logo is visible
    await navbarPage.verifyLogoIsVisible();

    // Click logo
    await navbarPage.clickLogo();

    // Verify navigation to home
    await expect(page).toHaveURL('https://www.cinesa.es/');
  });
});
```

### Example 3: Generic WebActions

```typescript
// Extracted from: core/webactions/webActions.ts
export class WebActions {
  constructor(private page: Page) {}

  async clickWithOverlayHandling(selector: string): Promise<void> {
    // Wait for element to be visible
    await this.page.locator(selector).waitFor({ state: 'visible' });

    // Handle common overlays
    const overlays = ['.modal-backdrop', '.overlay', '[role="dialog"]'];
    for (const overlay of overlays) {
      try {
        const overlayElement = this.page.locator(overlay).first();
        if (await overlayElement.isVisible({ timeout: 1000 })) {
          await overlayElement.click({ timeout: 2000 });
          await this.page.waitForTimeout(1000);
        }
      } catch {
        // Continue if overlay doesn't exist
      }
    }

    // Click with force as fallback
    await this.page.locator(selector).click({ force: true });
  }
}
```

### Example 4: Environment Configuration

```typescript
// Extracted from: config/environments.ts
export const cinesaEnvironments = {
  production: {
    baseUrl: 'https://www.cinesa.es',
    timeouts: {
      pageLoad: 30000,
      element: 10000,
      modal: 15000,
    },
    features: {
      analytics: true,
      promotionalModals: true,
      cookieBanners: true,
    },
  },
  staging: {
    baseUrl: 'https://staging.cinesa.es',
    timeouts: {
      pageLoad: 30000,
      element: 10000,
      modal: 15000,
    },
    features: {
      analytics: false,
      promotionalModals: true,
      cookieBanners: true,
    },
  },
} as const satisfies Record<string, EnvironmentConfig>;
```

## ✅ Review Checklist

### For Page Objects

- [ ] Descriptive and well-documented methods
- [ ] Private and constant selectors
- [ ] Clear separation between actions and verifications
- [ ] Appropriate error handling
- [ ] TypeScript strict mode compliance

### For Test Cases

- [ ] Descriptive names explaining behavior
- [ ] Correct use of fixtures
- [ ] Externalized test data
- [ ] Clear and specific assertions
- [ ] Appropriate tags for categorization

### For General Code

- [ ] Linting rules passing without warnings
- [ ] JSDoc for public methods
- [ ] Explicit TypeScript types
- [ ] Naming conventions followed
- [ ] No duplicated code

### For Architecture

- [ ] Clear responsibilities per layer
- [ ] Low coupling between components
- [ ] High cohesion within modules
- [ ] SOLID principles applied
- [ ] Consistent design patterns

---

**Last Updated**: October 2, 2025  
**Version**: 1.0.0  
**Maintained by**: @fcabanilla

---

> **Available in other languages:**
>
> - [Español](./STYLEGUIDE.es.md) | **English** (current)
