# 🏗️ Architecture - Cinema Multi-Platform Test Automation Framework

This document outlines the system architecture, design decisions, and structural patterns of the test automation framework for Cinesa and UCI cinema platforms.

## 📋 Table of Contents

- [🎯 System Overview](#-system-overview)
- [🏛️ Architectural Patterns](#️-architectural-patterns)
- [🏗️ Component Architecture](#️-component-architecture)
- [📊 Data Flow](#-data-flow)
- [🔌 Platform Integration](#-platform-integration)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [🧪 Testing Strategy](#-testing-strategy)
- [📈 Scalability and Maintenance](#-scalability-and-maintenance)
- [🛠️ Technology Decisions](#️-technology-decisions)

## 🎯 System Overview

### Purpose and Scope

The framework is designed to perform end-to-end testing of cinema platforms with focus on:

- **Multi-platform support**: Cinesa (Spain) and UCI (Italy)
- **Critical user flows**: Movie booking, seat selection, payment processing
- **Cross-browser compatibility**: Chrome, Firefox, Safari, Edge
- **Environment coverage**: Production, staging, and development
- **Performance monitoring**: Load times and responsiveness metrics

### Stakeholders

#### Primary Stakeholders

- QA Engineers: Daily test execution and maintenance
- Developers: Integration with CI/CD pipelines
- Product Teams: Feature validation and regression testing
- DevOps: Infrastructure and deployment automation

#### Secondary Stakeholders

- Business Analysts: Acceptance criteria validation
- Support Teams: Issue reproduction and diagnosis
- Management: Quality metrics and reporting

## 🏛️ Architectural Patterns

### Page Object Model (POM)

**Implementation Pattern**:

The framework follows an enhanced Page Object Model with clear separation of concerns:

```text
Component Structure:
├── Page Objects (pageObjectsManagers/)
│   ├── Component Pages (.page.ts)
│   ├── Selectors (.selectors.ts)
│   └── Type Definitions (.types.ts)
│
├── Test Layer (tests/)
│   ├── Test Cases (.spec.ts)
│   ├── Test Data (.data.ts)
│   └── Custom Assertions (.assertions.ts)
│
├── Core Utilities (core/)
│   ├── WebActions (webactions/)
│   ├── Base Classes (base/)
│   ├── Type Definitions (types/)
│   └── Shared Assertions (assertions/)
```

**Benefits**:

- **Maintainability**: UI changes require updates in single location
- **Reusability**: Common actions shared across test suites
- **Readability**: Tests express business intent, not technical implementation
- **Scalability**: New pages and components easily integrated

### Dependency Injection Pattern

**Implementation**:

Uses Playwright's fixture system for dependency management:

```typescript
// Fixture Definition
export const test = base.extend<{
  navbarPage: NavbarPage;
  moviePage: MoviePage;
  seatPage: SeatPage;
}>({
  navbarPage: async ({ page }, use) => {
    await use(new NavbarPage(page));
  },
});

// Test Usage
test('booking flow', async ({ moviePage, seatPage }) => {
  await moviePage.selectMovie('Avengers');
  await seatPage.selectSeats(2);
});
```

**Benefits**:

- **Testability**: Easy mocking and isolation
- **Configuration**: Environment-specific implementations
- **Lifecycle Management**: Automatic setup and teardown
- **Type Safety**: Compile-time dependency validation

### Factory Pattern

**Implementation**:

For creating platform-specific configurations and page objects:

```typescript
// Platform Factory
class PlatformFactory {
  static createConfig(platform: CinemaChain): EnvironmentConfig {
    switch (platform) {
      case 'cinesa':
        return new CinesaConfig();
      case 'uci':
        return new UCIConfig();
    }
  }
}

// Usage
const config = PlatformFactory.createConfig('cinesa');
const moviePage = new MoviePage(page, config);
```

### Architectural Boundaries and Access Control

**CRITICAL RULE**: The framework enforces strict separation between layers to maintain code quality, testability, and maintainability.

#### Access Control Rules

##### Rule 1: Playwright API Access Restriction

**✅ ALLOWED to access Playwright API (`page` object) directly:**

- `WebActions` class (core/webactions/)
- Assertion classes (\*.assertions.ts)
- Test files (\*.spec.ts) - only for test-specific operations

**❌ FORBIDDEN to access Playwright API directly:**

- Page Object classes (\*.page.ts)
- Selector files (\*.selectors.ts)
- Data files (\*.data.ts)
- Helper utilities (\*.helpers.ts)

**Rationale**: Centralizing Playwright API access in WebActions enables:

- Single point of change when Playwright API evolves
- Consistent error handling and retry logic
- Easy mocking for unit tests
- Platform-specific adaptations without cascading changes

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
  constructor(private readonly page: Page) {} // ❌ Forbidden

  async selectMovie(title: string): Promise<void> {
    // ❌ Direct Playwright API usage - FORBIDDEN
    await this.page.click(`[data-title="${title}"]`);
    await this.page.waitForSelector('.movie-detail');
  }
}
```

##### Rule 2: Selector Separation

**ALL selectors MUST be defined in dedicated `.selectors.ts` files.**

**✅ CORRECT Pattern:**

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

  async clickLogo(): Promise<void> {
    await this.webActions.click(this.selectors.logo);
  }
}
```

**❌ FORBIDDEN Pattern:**

```typescript
// navbar.page.ts - WRONG!
export class NavbarPage {
  async clickLogo(): Promise<void> {
    // ❌ Inline selector - FORBIDDEN
    await this.webActions.click('[data-testid="navbar-logo"]');
  }
}
```

**Rationale**:

- Selector changes don't require modifying page object logic
- Selectors reusable across multiple methods
- Easy to update when UI changes
- Clear separation of concerns (what vs where)

##### Rule 3: Page Object Responsibilities

**Page Objects MUST:**

- Define business-level page interactions
- Use selectors from `.selectors.ts` files
- Delegate all browser interactions to WebActions
- Return business-level data (strings, numbers, objects)
- Handle page-specific logic and workflows

**Page Objects MUST NOT:**

- Access Playwright API (`page`, `locator`, `elementHandle`) directly
- Contain inline selectors as magic strings
- Implement browser interaction logic (clicks, waits, fills)
- Return Playwright types (Locator, ElementHandle)
- Contain test assertions (belongs in .assertions.ts)

**Example:**

```typescript
// ✅ CORRECT: High-level business methods
export class TicketPickerPage {
  constructor(
    private readonly webActions: WebActions,
    private readonly selectors: TicketPickerSelectors
  ) {}

  async selectAdultTickets(quantity: number): Promise<void> {
    // ✅ Business logic with WebActions delegation
    for (let i = 0; i < quantity; i++) {
      await this.webActions.click(this.selectors.adultPlusButton);
    }
  }

  async getTicketTotal(): Promise<string> {
    // ✅ Returns business data, not Locator
    return await this.webActions.getText(this.selectors.totalPrice);
  }
}
```

##### Rule 4: WebActions as Gateway

**WebActions class responsibilities:**

- Encapsulate ALL Playwright API interactions
- Provide high-level interaction methods (click, fill, getText, etc.)
- Handle waits, retries, and error handling
- Abstract browser-specific behaviors
- Log actions for debugging and reporting

**Example:**

```typescript
// core/webactions/webActions.ts
export class WebActions {
  constructor(public readonly page: Page) {} // ✅ Only here

  async click(selector: string, options?: ClickOptions): Promise<void> {
    await this.page.click(selector, options); // ✅ Encapsulated
  }

  async getText(selector: string): Promise<string> {
    return (await this.page.textContent(selector)) || '';
  }

  async waitForVisible(selector: string): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible' });
  }
}
```

#### Enforcement Mechanisms

**Automated Checks:**

- ESLint rules restrict imports in page objects
- TypeScript compiler enforces type boundaries
- Pre-commit hooks detect architectural violations
- CI/CD pipeline fails on rule violations

**Manual Reviews:**

- Code review checklist includes architectural compliance
- Architecture review sessions for major changes
- Team training on architectural rules
- Pair programming for complex implementations

#### References

For detailed implementation guidelines and examples, see:

- [ADR-0009: Page Object Architecture and Access Control Rules](./adrs/0009-page-object-architecture-rules.md)
- [WebActions Implementation](../core/webactions/webActions.ts)
- [Example Page Objects](../pageObjectsManagers/)

## 🏗️ Component Architecture

### Layer Architecture

#### Layer 1: Test Orchestration

```text
Tests (tests/)
├── Cinesa Platform Tests
│   ├── User Flows (booking/, navigation/)
│   ├── Component Tests (navbar/, footer/)
│   └── Integration Tests (payment/, analytics/)
├── UCI Platform Tests
│   ├── User Flows (booking/, navigation/)
│   └── Component Tests (navbar/, footer/)
└── Shared Test Utilities
    ├── Test Data Builders
    ├── Common Assertions
    └── Test Helpers
```

#### Layer 2: Page Abstraction

```text
Page Objects (pageObjectsManagers/)
├── Cinesa Components
│   ├── Navigation (navbar/, footer/)
│   ├── Content (movies/, cinemas/)
│   ├── Booking Flow (tickets/, seats/, payment/)
│   └── User Management (login/, signup/)
├── UCI Components
│   ├── Navigation (navbar/, footer/)
│   ├── Content (films/, cinemas/)
│   └── Booking Flow (booking/, payment/)
└── Shared Components
    ├── Base Page Classes
    ├── Common UI Patterns
    └── Generic Form Handlers
```

#### Layer 3: Core Functionality

```text
Core Services (core/)
├── WebActions
│   ├── Browser Interactions
│   ├── Element Handlers
│   └── Wait Strategies
├── Assertions
│   ├── Custom Matchers
│   ├── Business Logic Validators
│   └── Performance Assertions
├── Base Classes
│   ├── BasePage
│   ├── BaseTest
│   └── BaseAssertion
└── Types
    ├── Global Interfaces
    ├── Platform Types
    └── Test Data Models
```

#### Layer 4: Configuration

```text
Configuration (config/)
├── Environment Configs
│   ├── Production Settings
│   ├── Staging Settings
│   └── Development Settings
├── URL Mappings
│   ├── Cinesa URLs
│   ├── UCI URLs
│   └── Test Environment URLs
└── Test Settings
    ├── Timeouts
    ├── Browser Configurations
    └── Test Data Paths
```

### Component Interaction Flow

**Test Execution Flow**:

1. **Test Initialization**

   - Fixture injection resolves dependencies
   - Environment configuration loaded
   - Browser context created with platform settings

2. **Page Object Creation**

   - Platform-specific page objects instantiated
   - Selectors and configurations applied
   - Navigation and setup methods executed

3. **Test Action Execution**

   - Business actions performed through page objects
   - Core WebActions handle browser interactions
   - Error handling and retry mechanisms applied

4. **Assertion and Validation**

   - Custom assertions validate business logic
   - Performance metrics captured
   - Results logged and reported

5. **Cleanup and Reporting**
   - Browser contexts closed
   - Test artifacts collected
   - Results sent to reporting systems

## 📊 Data Flow

### Configuration Data Flow

**Environment Loading**:

```text
Environment Selection → Configuration Loading → Platform Initialization

Environment Variables (CI/CD)
    ↓
Config Factory (environments.ts)
    ↓
Platform-Specific Config
    ↓
Page Object Initialization
    ↓
Test Execution
```

**Data Sources**:

- Environment Variables: Platform, environment, browser settings
- Configuration Files: URLs, timeouts, feature flags
- Test Data Files: User credentials, booking data, validation sets

### Test Data Management

**Test Data Flow**:

```text
Static Data Files → Data Builders → Test Fixtures → Test Execution

JSON Data Files (.data.ts)
    ↓
Data Builder Classes
    ↓
Fixture Injection
    ↓
Test Case Execution
    ↓
Cleanup and Reset
```

**Data Categories**:

- **User Data**: Credentials, profiles, preferences
- **Business Data**: Movies, showtimes, prices, promotions
- **Configuration Data**: URLs, timeouts, browser settings
- **Validation Data**: Expected results, error messages, assertions

## 🔌 Platform Integration

### Cinesa Platform Integration

**Key Integration Points**:

- **Authentication System**: Login/logout flows with session management
- **Movie Catalog**: Dynamic content loading and filtering
- **Booking Engine**: Seat selection, pricing, payment processing
- **Analytics Tracking**: Event capture and validation
- **Responsive Design**: Mobile and desktop viewport testing

**Technical Considerations**:

- **Session Persistence**: Stored authentication states
- **Dynamic Content**: Wait strategies for AJAX-loaded content
- **Cloudflare Protection**: Handling security challenges
- **Geographic Restrictions**: Location-based content variations
- **Performance Optimization**: Caching and CDN considerations

### UCI Platform Integration

**Key Integration Points**:

- **Multi-language Support**: Italian/English content switching
- **Cinema Location System**: Geographic-based cinema filtering
- **Booking Flow**: Simplified seat selection process
- **Payment Integration**: Local payment method support
- **Mobile Experience**: Touch-optimized interactions

**Technical Considerations**:

- **Language Detection**: Automatic locale switching
- **Currency Handling**: Euro-based pricing validation
- **Regional Content**: Location-specific movie availability
- **Performance Metrics**: European CDN response times

### Cross-Platform Patterns

**Shared Functionality**:

1. **Navigation Patterns**

   - Header/footer components
   - Menu systems and breadcrumbs
   - Search functionality

2. **Booking Workflows**

   - Movie selection processes
   - Seat picker components
   - Payment form handling

3. **User Management**

   - Registration/login flows
   - Profile management
   - Preference settings

4. **Content Management**
   - Movie listing displays
   - Cinema information pages
   - Promotional content

## ⚙️ Environment Configuration

### Environment Strategy

**Multi-Environment Support**:

```text
Environment Hierarchy:
├── Production (www.cinesa.es, www.uci.it)
├── Staging (staging.cinesa.es, staging.uci.it)
├── Development (dev.cinesa.es, dev.uci.it)
└── Local (localhost development)
```

**Configuration Management**:

```typescript
interface EnvironmentConfig {
  baseUrl: string;
  timeouts: TimeoutConfig;
  features: FeatureFlags;
  credentials: TestCredentials;
  performance: PerformanceThresholds;
}

const environments = {
  production: {
    baseUrl: 'https://www.cinesa.es',
    timeouts: { pageLoad: 10000, element: 5000 },
    features: { analytics: true, debugging: false },
    performance: { loadTime: 3000, ttfb: 1000 },
  },
};
```

### Feature Flags

**Dynamic Feature Control**:

- **Analytics Tracking**: Enable/disable analytics validation
- **Performance Monitoring**: Control performance test execution
- **Debug Logging**: Detailed logging for troubleshooting
- **Experimental Features**: Beta feature testing
- **Geographic Features**: Location-based functionality

### Browser Configuration

**Multi-Browser Strategy**:

```text
Browser Matrix:
├── Chrome (Latest, Latest-1)
├── Firefox (Latest, ESR)
├── Safari (Latest on macOS)
├── Edge (Latest)
└── Mobile (Chrome Mobile, Safari Mobile)
```

**Configuration Options**:

- **Viewport Sizes**: Desktop, tablet, mobile breakpoints
- **Device Emulation**: iPhone, iPad, Android devices
- **Network Conditions**: Fast 3G, slow 3G, offline
- **Performance Profiles**: CPU throttling, network throttling

## 🧪 Testing Strategy

### Test Pyramid Implementation

**Unit Tests (Fast, Isolated)**:

- Utility function validation
- Data transformation logic
- Configuration parsing
- Helper method testing

**Integration Tests (Component Interaction)**:

- Page object interaction testing
- Navigation flow validation
- Form submission workflows
- API integration points

**End-to-End Tests (Full User Flows)**:

- Complete booking journeys
- User registration processes
- Payment flow validation
- Cross-platform consistency

### Test Categories

**Functional Testing**:

- **Smoke Tests**: Critical path validation
- **Regression Tests**: Feature stability verification
- **Acceptance Tests**: Business requirement validation
- **Integration Tests**: System component interaction

**Non-Functional Testing**:

- **Performance Tests**: Load time and responsiveness
- **Accessibility Tests**: WCAG compliance validation
- **Security Tests**: Input validation and XSS prevention
- **Compatibility Tests**: Browser and device coverage

### Test Data Strategy

**Data Management Approach**:

```text
Test Data Hierarchy:
├── Static Data (JSON files)
├── Generated Data (Builders/Factories)
├── Environment Data (Config-specific)
└── Runtime Data (Test-generated)
```

**Data Categories**:

- **User Profiles**: Various user types and permissions
- **Business Data**: Movies, showtimes, pricing tiers
- **Geographic Data**: Locations, cinemas, availability
- **Payment Data**: Cards, methods, currencies

## 📈 Scalability and Maintenance

### Horizontal Scaling

**Platform Expansion**:

- **New Cinema Chains**: Plugin architecture for additional platforms
- **Geographic Expansion**: Multi-region support framework
- **Feature Growth**: Modular component architecture
- **Team Growth**: Clear ownership and responsibility boundaries

### Maintenance Strategy

**Code Maintenance**:

- **Automated Refactoring**: ESLint rules and automatic fixes
- **Dependency Management**: Regular updates and security patches
- **Performance Monitoring**: Continuous test execution metrics
- **Documentation Updates**: Automated documentation generation

**Test Maintenance**:

- **Selector Stability**: Data-testid strategy for reliable element location
- **Test Data Refresh**: Automated test data generation and updates
- **Environment Parity**: Configuration synchronization across environments
- **Failure Analysis**: Automated failure categorization and reporting

### Monitoring and Observability

**Test Execution Monitoring**:

- **Success Rates**: Test pass/fail trends over time
- **Performance Metrics**: Execution time and resource usage
- **Flakiness Detection**: Unstable test identification
- **Coverage Analysis**: Feature and code coverage tracking

**Application Monitoring**:

- **Performance Baselines**: Page load time benchmarks
- **Error Detection**: Client-side error capture and analysis
- **User Experience**: Conversion funnel and usability metrics
- **Security Monitoring**: Vulnerability scanning and penetration testing

## 🛠️ Technology Decisions

### Core Technology Stack

**Testing Framework**: Playwright 1.50.1

- **Justification**: Superior browser automation, built-in parallelization, excellent debugging tools
- **Alternatives Considered**: Selenium, Cypress, Puppeteer
- **Decision Factors**: Cross-browser support, speed, reliability, TypeScript integration

**Language**: TypeScript 5.8.2

- **Justification**: Type safety, excellent IDE support, JavaScript ecosystem compatibility
- **Alternatives Considered**: JavaScript, Python, Java
- **Decision Factors**: Static typing, refactoring support, team expertise

**Reporting**: Allure 3.2.0

- **Justification**: Rich visual reports, historical trends, integration capabilities
- **Alternatives Considered**: HTML Reporter, JUnit XML, Custom dashboards
- **Decision Factors**: Visual appeal, stakeholder communication, CI/CD integration

### Supporting Technologies

**Code Quality**: ESLint 9.21.0

- **Purpose**: Enforce coding standards, prevent common errors
- **Configuration**: Strict TypeScript rules, accessibility checks, performance guidelines

**Version Control**: Git with conventional commits

- **Purpose**: Change tracking, collaboration, automated release notes
- **Strategy**: Feature branches, pull request workflows, automated testing

**CI/CD Integration**: Azure DevOps

- **Purpose**: Automated testing, deployment pipelines, work item tracking
- **Features**: Multi-stage pipelines, environment promotion, quality gates

### Architecture Decision Records

**Major Decisions Documented**:

1. **ADR-001**: Playwright vs Selenium selection criteria and rationale
2. **ADR-002**: TypeScript adoption for type safety and maintainability
3. **ADR-003**: Multi-platform architecture design for Cinesa and UCI
4. **ADR-004**: Page Object Model implementation strategy
5. **ADR-005**: Test data management and environment configuration

**Decision Process**:

- **Problem Definition**: Clear statement of technical challenge
- **Options Analysis**: Comparison of available solutions
- **Decision Criteria**: Performance, maintainability, team expertise, cost
- **Implementation Plan**: Migration strategy and timeline
- **Review Schedule**: Regular reassessment and updates

### Performance Considerations

**Framework Performance**:

- **Parallel Execution**: Multi-worker test execution
- **Resource Optimization**: Memory and CPU usage monitoring
- **Network Efficiency**: Request interception and mocking
- **Storage Management**: Test artifacts and report cleanup

**Application Performance**:

- **Baseline Establishment**: Performance benchmark creation
- **Regression Detection**: Automated performance testing
- **Optimization Tracking**: Performance improvement validation
- **User Experience**: Real user monitoring integration

---

**Last Updated**: October 2, 2025  
**Version**: 1.0.0  
**Maintained by**: @fcabanilla

---

> **Available in other languages:**
>
> - [Español](./ARCHITECTURE.es.md) | **English** (current)
