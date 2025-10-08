# ADR-0009: Page Object Architecture and Access Control Rules

**Status**: Accepted

**Date**: 2025-10-08

**Authors**: [@fcabanilla]

**Reviewers**: [@qa-team]

## Context

As the test automation framework grows with multiple platforms (Cinesa, UCI) and hundreds of test cases, maintaining consistency in how components interact with Playwright API and selectors becomes critical. Without clear architectural rules, teams may create direct dependencies that lead to tight coupling, difficult maintenance, and brittle tests.

### Background

- **200+ page objects** across Cinesa and UCI platforms
- Multiple team members contributing to the framework
- Risk of inconsistent patterns and direct API usage
- Need for clear separation of concerns
- Playwright API changes require centralized adaptation
- Selector changes must not cascade through entire codebase

### Forces at Play

- **Maintainability**: Changes in selectors or API should have minimal ripple effects
- **Testability**: Components should be easily testable in isolation
- **Consistency**: All team members must follow same patterns
- **Learning Curve**: New team members need clear guidelines
- **Type Safety**: TypeScript should enforce architectural boundaries
- **Refactoring**: Large-scale changes should be manageable

## Decision

### Chosen Option

**Implement strict architectural layers with enforced access control rules: Page Objects never access Playwright API directly, never use inline selectors, and delegate all browser interactions to WebActions abstraction layer.**

### Architectural Rules

#### Rule 1: Selector Separation

**✅ ALLOWED:**

```typescript
// navbar.selectors.ts
export const navbarSelectors = {
  logo: '[data-testid="navbar-logo"]',
  menuButton: '[data-testid="navbar-menu"]',
  searchInput: 'input[name="search"]',
} as const;

// navbar.page.ts
import { navbarSelectors } from './navbar.selectors';

export class NavbarPage {
  private readonly selectors = navbarSelectors;

  async clickLogo() {
    await this.webActions.click(this.selectors.logo);
  }
}
```

**❌ FORBIDDEN:**

```typescript
// navbar.page.ts - WRONG!
export class NavbarPage {
  async clickLogo() {
    // ❌ NO: Inline selector
    await this.webActions.click('[data-testid="navbar-logo"]');

    // ❌ NO: Direct Playwright API access
    await this.page.click('[data-testid="navbar-logo"]');
  }
}
```

#### Rule 2: Playwright API Access Control

**✅ ALLOWED TO ACCESS `page` DIRECTLY:**

- `WebActions` class (core/webactions/)
- Assertion classes (\*.assertions.ts)
- Test files (\*.spec.ts) - only for test-specific operations

**❌ FORBIDDEN TO ACCESS `page` DIRECTLY:**

- Page Object classes (\*.page.ts)
- Selector files (\*.selectors.ts)
- Data files (\*.data.ts)
- Helper utilities (\*.helpers.ts)

**Example:**

```typescript
// ✅ CORRECT: Page Object delegates to WebActions
export class MoviesPage {
  constructor(
    private readonly webActions: WebActions // ✅ Uses abstraction
    // NO private page: Page - ❌ Direct access forbidden
  ) {}

  async selectMovie(title: string): Promise<void> {
    // ✅ All interactions through WebActions
    await this.webActions.click(this.selectors.movieCard(title));
    await this.webActions.waitForVisible(this.selectors.movieDetail);
  }
}
```

```typescript
// ❌ WRONG: Page Object accessing Playwright API directly
export class MoviesPage {
  constructor(private readonly page: Page) {} // ❌ Direct page access

  async selectMovie(title: string): Promise<void> {
    // ❌ Direct Playwright API usage
    await this.page.click(`[data-title="${title}"]`);
    await this.page.waitForSelector('.movie-detail');
  }
}
```

#### Rule 3: WebActions Abstraction

**WebActions Responsibilities:**

- Encapsulate ALL Playwright API interactions
- Provide high-level interaction methods
- Handle waits, retries, and error handling
- Abstract browser-specific behaviors

**Page Object Responsibilities:**

- Define business-level page interactions
- Use selectors from `.selectors.ts` files
- Call WebActions methods with selector + data
- Return business-level data (not Locators or Elements)

**Example:**

```typescript
// ✅ WebActions (ONLY place to use Playwright API)
export class WebActions {
  constructor(public readonly page: Page) {} // ✅ Only here

  async click(selector: string): Promise<void> {
    await this.page.click(selector); // ✅ Encapsulated
  }

  async fill(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value); // ✅ Encapsulated
  }
}
```

```typescript
// ✅ Page Object (uses WebActions)
export class LoginPage {
  constructor(private readonly webActions: WebActions) {}

  async login(email: string, password: string): Promise<void> {
    // ✅ Delegates to WebActions
    await this.webActions.fill(this.selectors.emailInput, email);
    await this.webActions.fill(this.selectors.passwordInput, password);
    await this.webActions.click(this.selectors.submitButton);
  }
}
```

#### Rule 4: Assertions Access

**Assertion classes CAN access page directly** for validation purposes:

```typescript
// ✅ Assertions can use page for validations
export class MoviesAssertions {
  constructor(
    private readonly page: Page, // ✅ Allowed for assertions
    private readonly moviesPage: MoviesPage
  ) {}

  async assertMovieDisplayed(title: string): Promise<void> {
    // ✅ Can use page for complex validations
    const movieElement = await this.page.locator(`[data-title="${title}"]`);
    await expect(movieElement).toBeVisible();
  }
}
```

#### Rule 5: File Organization

**Required Structure:**

```text
pageObjectsManagers/
├── cinesa/
│   ├── movies/
│   │   ├── movies.page.ts         # ✅ Page interactions (uses WebActions)
│   │   ├── movies.selectors.ts    # ✅ All selectors centralized
│   │   └── movies.types.ts        # ✅ Type definitions (optional)
│   └── navbar/
│       ├── navbar.page.ts
│       └── navbar.selectors.ts
tests/
├── cinesa/
│   ├── movies/
│   │   ├── movies.spec.ts         # ✅ Test cases (can use page)
│   │   ├── movies.assertions.ts   # ✅ Assertions (can use page)
│   │   └── movies.data.ts         # ✅ Test data
```

### Considered Alternatives

#### Option A: Allow Direct Playwright Access in Page Objects

- **Pros**:
  - Faster initial development
  - Less abstraction layers
  - Direct access feels more natural
- **Cons**:
  - Tight coupling to Playwright API
  - Difficult to mock for unit tests
  - API changes cascade through all page objects
  - Inconsistent patterns across team
  - Hard to enforce standards
- **Reason for rejection**: Technical debt accumulates quickly, maintenance nightmare

#### Option B: Full Abstraction (No Direct Access Anywhere)

- **Pros**:
  - Complete isolation from Playwright
  - Could swap frameworks entirely
  - Maximum testability
- **Cons**:
  - Over-engineering for current needs
  - Complex abstractions hard to learn
  - Performance overhead
  - Difficult to handle edge cases
- **Reason for rejection**: Too restrictive, diminishing returns

#### Option C: Layered Access with WebActions (Chosen)

- **Pros**:
  - Clear separation of concerns
  - Centralized Playwright API usage
  - Easy to maintain and refactor
  - Consistent patterns across codebase
  - Assertions retain flexibility
  - Gradual adoption possible
- **Cons**:
  - Initial learning curve for team
  - Requires discipline to follow rules
  - Some duplication in WebActions methods
- **Reason for selection**: Best balance of maintainability, flexibility, and practicality

## Consequences

### Positive

- **Centralized API Access**: Playwright API changes only affect WebActions
- **Selector Reusability**: Selectors defined once, used everywhere
- **Consistent Patterns**: All page objects follow same structure
- **Easier Refactoring**: Selector changes don't cascade through tests
- **Better Testing**: Page objects easy to unit test with mocked WebActions
- **Team Onboarding**: Clear rules make onboarding faster
- **Type Safety**: TypeScript enforces architectural boundaries
- **Reduced Coupling**: Page objects depend on abstractions, not implementations

### Negative

- **Learning Curve**: New team members must learn architectural rules
- **Discipline Required**: Rules must be enforced through code reviews
- **Abstraction Overhead**: Extra layer adds some complexity
- **WebActions Growth**: May become large as framework grows
- **Initial Slower Development**: Setting up layers takes more time upfront

### Neutral

- **Code Volume**: More files (selectors separate), but better organized
- **Performance**: Negligible impact from abstraction layer
- **Tooling**: ESLint rules needed to enforce architectural boundaries

## Implementation

### Implementation Plan

#### Phase 1: Documentation and Standards (Week 1)

1. **Update Architecture Documentation**:

   - Add detailed section on access control rules
   - Create visual diagrams of layer architecture
   - Document do's and don'ts with examples

2. **Create Code Templates**:

   - VS Code snippets for page objects
   - Template files for new components
   - ESLint rules to enforce patterns

3. **Team Training**:
   - Architecture review session
   - Code examples walkthrough
   - Q&A and clarifications

#### Phase 2: Audit Existing Code (Week 1-2)

1. **Identify Violations**:

   ```bash
   # Find page objects with direct page access
   grep -r "private.*page: Page" pageObjectsManagers/

   # Find inline selectors
   grep -r "\.click\('[^']*'\)" pageObjectsManagers/
   ```

2. **Create Refactoring Backlog**:
   - List all files violating rules
   - Prioritize by usage frequency
   - Assign to team members

#### Phase 3: Enforce in New Code (Ongoing)

1. **Add ESLint Rules**:

   ```javascript
   // .eslintrc.js
   rules: {
     'no-restricted-imports': ['error', {
       patterns: [{
         group: ['@playwright/test'],
         message: 'Page Objects must not import Playwright types directly'
       }]
     }]
   }
   ```

2. **Code Review Checklist**:

   - [ ] Selectors in separate `.selectors.ts` file?
   - [ ] Page Object uses WebActions, not direct page access?
   - [ ] No inline selectors in Page Object methods?
   - [ ] Assertions properly use Page for validations?

3. **Pre-commit Hooks**:

   ```bash
   # Check for direct page usage in page objects
   git diff --cached | grep -E "class.*Page.*private.*page: Page"
   ```

#### Phase 4: Gradual Migration (Week 2-4)

1. **Refactor High-Priority Page Objects**:

   - Start with most-used page objects (navbar, movies, login)
   - Extract selectors to `.selectors.ts` files
   - Replace direct page access with WebActions calls
   - Update tests to use new patterns

2. **Create Migration Examples**:
   - Before/after comparison docs
   - Step-by-step migration guide
   - Video walkthrough for team

### Success Criteria

- [ ] All new page objects follow architectural rules
- [ ] ESLint rules enforcing patterns in place
- [ ] 80%+ of existing page objects migrated to new pattern
- [ ] Zero direct Playwright API access in page objects
- [ ] All selectors extracted to `.selectors.ts` files
- [ ] Team trained and following guidelines
- [ ] Code review checklist in use

### Rollback Plan

- Rules are guidelines, not breaking changes
- Gradual adoption allows parallel patterns temporarily
- Can disable ESLint rules if causing blockers
- Existing tests continue working during migration

## Notes

### Enforcement Strategy

**Automated Enforcement:**

- ESLint rules for import restrictions
- TypeScript compiler strict mode
- Pre-commit hooks checking patterns
- CI/CD pipeline failing on violations

**Manual Enforcement:**

- Code review checklist
- Architecture review sessions
- Pair programming on new features
- Regular architecture audits

### Migration Priority

**High Priority** (Migrate First):

- Navbar (used in every test)
- Login/Signup (critical flows)
- Movies/Films (core functionality)

**Medium Priority** (Migrate Second):

- Cinemas
- Seat Picker
- Ticket Picker

**Low Priority** (Migrate Last):

- Footer
- Blog
- Analytics
- Mailing

### Examples from Existing Code

**Good Example (Follows Rules):**

```typescript
// ✅ tests/uci/films/films.page.ts
export class Films {
  readonly webActions: WebActions;
  readonly selectors: FilmsSelectors;

  constructor(page: Page) {
    this.webActions = new WebActions(page); // ✅ WebActions abstraction
    this.selectors = filmsSelectors; // ✅ Centralized selectors
  }

  async selectFilmByTitle(filmTitle: string): Promise<void> {
    // ✅ Uses WebActions with selectors
    const filmSelector = await this._buildFilmSelector(filmTitle);
    await this.webActions.click(filmSelector);
  }
}
```

**Bad Example (Violates Rules):**

```typescript
// ❌ Example of what NOT to do
export class Films {
  constructor(private page: Page) {} // ❌ Direct page access

  async selectFilm(title: string): Promise<void> {
    // ❌ Inline selector
    await this.page.click(`[data-title="${title}"]`);

    // ❌ Direct Playwright API
    await this.page.waitForSelector('.film-detail');
  }
}
```

### Related Links

- [ADR-001: Playwright Framework](./0001-playwright-framework.md)
- [ADR-003: Multi-Cinema Architecture](./0003-multi-cinema-architecture.md)
- [Architecture Documentation](../ARCHITECTURE.md)
- [WebActions Implementation](../../core/webactions/webActions.ts)

### Update

- **Last review**: 2025-10-08 by [@fcabanilla]
- **Next review**: 2025-11-08
- **Implementation status**: In progress (documentation phase)

---

**Template Version**: 1.0
**Created**: October 8, 2025
**Maintained by**: Cinema Automation Team
