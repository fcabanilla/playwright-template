# 🎬 Cinema Multi-Platform Test Automation Framework

End-to-end test automation framework for multiple cinema chains using **Playwright** with **TypeScript**. Supports **Cinesa** (Spain), **UCI Cinemas** (Portugal), and **UCI Cinemas** (Italy) with scalable architecture for future expansions.

## 🎯 Project Purpose

This project solves the need for **consistent test automation** across multiple cinema platforms, ensuring:

- **Uniform quality** across different cinema brands
- **Early detection** of regressions in critical functionalities
- **Automated validation** of end-to-end purchase flows
- **Reduced time** on repetitive manual validations

### Expected Impact

- 🚀 **90% reduction** in manual validation time
- 🎯 **95% coverage** of critical user flows
- 📊 **Detailed reports** with quality metrics
- 🔄 **Continuous integration** with CI/CD

## 📁 Project Structure

```text
playwright-template/
├── 📁 config/                  # Environment configurations
│   ├── environments.ts        # URLs and platform configurations
│   └── urls.ts                # Centralized URL mappings
├── 📁 core/                   # Framework base functionalities
│   ├── assertions/            # Custom assertions
│   ├── base/                  # Base classes and abstractions
│   ├── types/                 # TypeScript type definitions
│   └── webactions/            # Unified web actions
├── 📁 fixtures/               # Dependency injection per platform
│   ├── cinesa/               # Cinesa-specific fixtures
│   └── uci/                  # UCI-specific fixtures
├── 📁 pageObjectsManagers/   # Page Object Model implementation
│   ├── cinesa/               # Cinesa platform components
│   └── uci/                  # UCI platform components
├── 📁 tests/                 # Test cases by platform
│   ├── cinesa/               # Cinesa end-to-end tests
│   └── uci/                  # UCI end-to-end tests
├── 📁 .allure/               # Reporting: results, report, artifacts
└── 📄 playwright.config.ts   # Main Playwright configuration
```

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 8+
- **Git** for version control

### Installation

```bash
# 1. Clone repository
git clone https://github.com/fcabanilla/playwright-template.git
cd playwright-template

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Verify installation
npm run test:cinesa:navbar
```

### Main Commands

#### Test Execution

```bash
# STANDARDIZED SCRIPTS - By Region/Environment
# Format: npm run test:{region}:{environment} -- {flags}

# Spain (Cinesa) - ES
npm run test:es                      # Spain production
npm run test:es:preprod              # Spain preprod
npm run test:es:lab                  # Spain lab
npm run test:es -- --grep '@smoke'   # Spain with smoke tests

# Portugal (UCI Cinemas) - PT
npm run test:pt                      # Portugal production
npm run test:pt:preprod              # Portugal preprod
npm run test:pt:lab                  # Portugal lab
npm run test:pt -- --grep '@smoke'   # Portugal with smoke tests

# Italy (UCI Cinemas) - IT
npm run test:it                      # Italy production
npm run test:it:preprod              # Italy preprod
npm run test:it:lab                  # Italy lab
npm run test:it -- --grep '@smoke'   # Italy with smoke tests

# DYNAMIC FLAGS - Combine any flags with base scripts
npm run test:es:preprod -- --grep '@smoke'                    # Smoke tests
npm run test:pt:preprod -- --grep '@critical' --headed        # Critical tests headed
npm run test:it:lab -- --grep '@fast' --workers=1             # Fast tests serial

# COMPONENT-SPECIFIC TESTS
npm run test:navbar              # Navigation (default: Spain production)
npm run test:movies              # Movies
npm run test:cinemas             # Cinemas
npm run test:seatpicker          # Seat selection
npm run test:footer              # Footer

# Component tests with environment override
TEST_ENV=preprod-pt npm run test:navbar     # Navbar in Portugal preprod
TEST_ENV=lab npm run test:seatpicker        # Seat picker in Spain lab

# LEGACY ALIASES (backward compatibility)
npm run test:cinesa              # → npm run test:es
npm run test:cinesa:preprod      # → npm run test:es:preprod
npm run test:uci                 # → npm run test:it
```

#### Reports and Analysis

```bash
# Generate and view Allure reports
npm run report:generate          # Generate HTML report from results
npm run report:open              # Open report in browser
npm run report                   # Generate + open in one command
npm run report:clean:results     # Clean results BEFORE new test execution (CRITICAL)
npm run report:clean             # Full cleanup (results + reports + videos)

# Development and debugging
npm run test:debug               # Debug mode
npm run test:headed              # With browser UI
npm run test:trace               # With trace recording
```

### ⚠️ CRITICAL: Allure Workflow - Results Accumulation

**Allure accumulates results by design.** If you don't clean `.allure/results/` before running tests, new results are ADDED to existing ones.

**Example of the problem:**

```bash
# First execution: 268 tests
npx playwright test

# Second execution: 1 test (without cleaning)
npx playwright test tests/cinesa/seatPicker/seatPicker.spec.ts:406:3

# Report shows: 269 tests (268 + 1) ❌ WRONG
```

**Correct workflow for single test execution:**

```bash
# Step 1: Clear old results (MANDATORY)
npm run report:clean:results

# Step 2: Run your test
TEST_ENV=preprod npx playwright test tests/cinesa/seatPicker/seatPicker.spec.ts:406:3 --project='Cinesa'

# Step 3: Generate report with history
npm run report

# Result: Report shows 1 test ✅ CORRECT
```

**Correct workflow for full test suite:**

```bash
# Step 1: Clear old results
npm run report:clean:results

# Step 2: Run complete suite
npm run test:cinesa:preprod

# Step 3: Generate report
npm run report
```

**Understanding Allure directories:**

- **`.allure/results/`** - Current execution data (JSON files)
  - **MUST be cleared** before each test run: `npm run report:clean:results`
  - Contains test results from current execution only
- **`.allure/report/history/`** - Historical trend data
  - **MUST be preserved** for TREND graphs
  - Automatically copied by `npm run report` command
  - Shows last 20 executions for trend analysis

**NPM Scripts (Correct Configuration):**

```json
{
  "report:clean:results": "rm -rf .allure/results/*", // Clears ONLY results
  "report": "npm run report:copy-history && npm run report:generate && npm run report:open",
  "report:copy-history": "mkdir -p .allure/results/history && (cp -r .allure/report/history/* .allure/results/history/ 2>/dev/null || true)"
}
```

**Common mistake:**

```json
// ❌ WRONG - This deletes videos, NOT results
"report:clean:results": "rm -rf .allure/playwright-artifacts/*"
```

## 🎯 Key Features

### Multi-Platform Architecture

- **Cinesa Spain**: Full support for Spanish market (`cinesa.es`)
- **UCI Portugal**: Complete Portuguese market coverage (`ucicinemas.pt`)
- **UCI Italy**: Complete Italian market coverage (`ucicinemas.it`)
- **Shared Components**: Reusable across platforms (Spain & Portugal share same HTML structure)
- **Scalable Design**: Easy addition of new cinema chains and regions

### Advanced Testing Capabilities

- **Cross-Browser**: Chrome, Firefox, Safari, Edge
- **Mobile Testing**: Responsive design validation
- **Performance Monitoring**: Load time and metrics tracking
- **Visual Testing**: Screenshot comparison and validation
- **API Integration**: Backend service testing

### Quality Assurance

- **TypeScript Strict Mode**: Complete type safety
- **ESLint Integration**: Code quality enforcement
- **Conventional Commits**: Standardized commit messages
- **CI/CD Integration**: Azure DevOps pipeline support
- **Allure Awesome Reporting**: Rich visual test reports with v3 support

### Pure Async Waiting Philosophy

This framework follows a **strict no-timeout policy** for maximum reliability:

- ❌ **NO fixed delays**: No `wait(500)`, `waitForTimeout(1000)`, etc.
- ❌ **NO explicit timeouts**: No `waitFor({ timeout: 5000 })` parameters
- ❌ **NO manual waits**: No `waitFor({ state: 'visible' })` when unnecessary
- ✅ **YES to Playwright auto-waiting**: Built-in smart waiting for actionability
- ✅ **YES to assertion auto-waiting**: `expect().toBeVisible()` handles timing
- ✅ **YES to action auto-waiting**: `click()`, `fill()` wait automatically

**Benefits:**

- 🚀 Tests run as fast as possible (no artificial delays)
- 🎯 More reliable (no race conditions from fixed timeouts)
- 🔧 Easier maintenance (Playwright handles complexity)
- 📊 Better debugging (failures are real issues, not timing problems)

## 🔧 Technology Stack

### Core Framework

- **Playwright** 1.50.1 - Modern web automation
- **TypeScript** 5.8.2 - Type-safe development
- **Node.js** 18+ - Runtime environment

### Testing & Quality

- **Allure** 3.2.0 - Advanced reporting
- **ESLint** 9.21.0 - Code linting
- **Conventional Commits** - Git standards

### CI/CD & DevOps

- **Azure DevOps** - Pipeline integration
- **GitHub Actions** - Workflow automation
- **Docker** - Containerization support

## 📖 Architecture Overview

### Page Object Model (Enhanced)

```typescript
// Example: Movie Page Object
export class MoviePage {
  constructor(private page: Page) {}

  private selectors = {
    movieCard: '[data-testid="movie-card"]',
    bookButton: '.book-now-button',
  } as const;

  async selectMovie(title: string): Promise<void> {
    await this.page
      .locator(this.selectors.movieCard)
      .filter({ hasText: title })
      .click();
  }
}
```

### Dependency Injection Pattern

```typescript
// Fixture-based dependency injection
export const test = base.extend<{
  moviePage: MoviePage;
  navbarPage: NavbarPage;
}>({
  moviePage: async ({ page }, use) => {
    await use(new MoviePage(page));
  },
});
```

### Multi-Environment & Multi-Region Support

```typescript
// Environment configuration with region support
export const cinesaEnvironments = {
  // Spain
  production: {
    baseUrl: 'https://www.cinesa.es',
    region: 'es',
    locale: 'es-ES',
  },
  preprod: {
    baseUrl: 'https://preprod-web.ocgtest.es',
    region: 'es',
    locale: 'es-ES',
  },
  lab: { baseUrl: 'https://lab-web.ocgtest.es', region: 'es', locale: 'es-ES' },

  // Portugal (shares Cinesa namespace - same HTML structure)
  'production-pt': {
    baseUrl: 'https://www.ucicinemas.pt',
    region: 'pt',
    locale: 'pt-PT',
  },
  'preprod-pt': {
    baseUrl: 'https://preprod-web.ocgtest.pt',
    region: 'pt',
    locale: 'pt-PT',
  },
  'lab-pt': {
    baseUrl: 'https://lab-web.cinesa.pt',
    region: 'pt',
    locale: 'pt-PT',
  },
};

export const uciEnvironments = {
  // Italy
  production: {
    baseUrl: 'https://ucicinemas.it',
    region: 'it',
    locale: 'it-IT',
  },
  preprod: {
    baseUrl: 'https://preprod.ucicinemas.it',
    region: 'it',
    locale: 'it-IT',
  },
};
```

## 🧪 Testing Strategy

### Test Pyramid

```text
   🔺 E2E Tests (End-to-End User Flows)
  🔶 Integration Tests (Component Interactions)
 🔷 Unit Tests (Isolated Component Logic)
```

### Test Categories

- **🚀 Smoke Tests**: Critical path validation (5-10 minutes)
- **🔄 Regression Tests**: Complete feature coverage (30-45 minutes)
- **⚡ Fast Tests**: Quick validation cycles (2-5 minutes)
- **🎯 Focused Tests**: Specific functionality validation

### Platform Coverage

#### Cinesa Spain Platform (ES)

- Movie browsing and filtering
- Cinema location selection (Oasiz, Grancasa)
- Seat picker functionality (30+ tests, 100% coverage)
- Payment flow validation
- User account management
- Mobile responsive testing
- Analytics tracking validation

#### UCI Portugal Platform (PT)

- Shared HTML structure with Spain (reuses Cinesa Page Objects)
- Portuguese language content
- Portugal-specific URLs and configurations
- Cloudflare Access protection (requires credentials)
- Multi-environment support (production, preprod, lab)

#### UCI Italy Platform (IT)

- Film catalog navigation
- Theater selection process
- Booking confirmation flow
- Italian language support
- Payment method validation
- Accessibility compliance

## 🌍 Environment Configuration

### Test Environments

- **Production**: Live cinema platforms (read-only tests)
- **Staging**: Pre-production validation environment
- **Development**: Development and debugging environment

### Environment Variables

```bash
# Set target environment (automatic with new scripts)
export TEST_ENV=production       # Spain production
export TEST_ENV=preprod          # Spain preprod
export TEST_ENV=lab              # Spain lab
export TEST_ENV=production-pt    # Portugal production
export TEST_ENV=preprod-pt       # Portugal preprod
export TEST_ENV=lab-pt           # Portugal lab

# Browser and execution settings
export BROWSER=chromium          # chromium | firefox | webkit
export WORKERS=4                 # Parallel execution workers (default)
export WORKERS=1                 # Serial execution (for Cloudflare environments)

# Cloudflare Access credentials (per region)
export CF_ACCESS_CLIENT_ID_PREPROD=xxx          # Spain preprod
export CF_ACCESS_CLIENT_SECRET_PREPROD=xxx
export CF_ACCESS_CLIENT_ID_PREPROD_PT=xxx       # Portugal preprod
export CF_ACCESS_CLIENT_SECRET_PREPROD_PT=xxx
export CF_ACCESS_CLIENT_ID_LAB_PT=xxx           # Portugal lab
export CF_ACCESS_CLIENT_SECRET_LAB_PT=xxx
```

### Configuration Files

- `playwright.config.ts` - Main Playwright configuration
- `config/environments.ts` - Environment-specific settings
- `config/urls.ts` - Platform URL mappings

## 📊 Reporting and Analytics

### Allure Reports

Rich interactive reports with:

- Test execution timeline
- Step-by-step execution details
- Screenshot and video attachments
- Performance metrics tracking
- Trend analysis and history

### CI/CD Integration

- **Azure DevOps**: Pipeline integration and work item tracking
- **GitHub Actions**: Automated testing on PR and merges
- **Quality Gates**: Automated quality checks and approvals

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

### Quick Contribution Steps

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** coding standards in [STYLEGUIDE.md](./docs/STYLEGUIDE.md)
4. **Write** tests for new functionality
5. **Commit** using conventional commits
6. **Submit** Pull Request

### Development Workflow

```bash
# Development setup
npm run dev:setup              # Initial development setup
npm run lint                   # Code quality check
npm run test:local             # Local test execution
npm run test:coverage          # Coverage analysis
```

## 📚 Documentation

### Core Documentation

- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System design and patterns
- **[Style Guide](./docs/STYLEGUIDE.md)** - Coding conventions and best practices
- **[ADRs](./docs/adrs/)** - Architectural Decision Records
- **[Contributing](./CONTRIBUTING.md)** - Contribution workflow and guidelines

### Configuration & Setup

- **[NPM Scripts (Standardized)](./docs/NPM_SCRIPTS_STANDARDIZED.md)** - New multi-region script system
- **[Portugal Configuration](./docs/PORTUGAL_CONFIGURATION.md)** - Portugal-specific setup
- **[Cloudflare Handling](./docs/CLOUDFLARE_HANDLING.md)** - Cloudflare bypass strategies
- **[URL Configuration](./docs/URL_CONFIGURATION.md)** - Multi-region URL management

### Technical References

- **[ADR-0010: Cloudflare Access Tokens](./docs/adrs/0010-cloudflare-access-tokens.md)** - Credentials strategy
- **[ADR-0009: Page Object Architecture](./docs/adrs/0009-page-object-architecture-rules.md)** - Architecture rules

## 🔒 Cloudflare Access Configuration

### Overview

**Cloudflare-Protected Environments:**

| Region        | Production | Preprod | Lab    |
| ------------- | ---------- | ------- | ------ |
| Spain (ES)    | ❌ No      | ✅ Yes  | ✅ Yes |
| Portugal (PT) | ✅ Yes     | ✅ Yes  | ✅ Yes |
| Italy (IT)    | ❌ No      | ✅ Yes  | ✅ Yes |

### Automatic Credentials Injection

The framework automatically injects Cloudflare Access credentials based on environment:

```bash
# Spain preprod - uses CF_ACCESS_CLIENT_ID_PREPROD
npm run test:es:preprod -- --headed --workers=1

# Portugal preprod - uses CF_ACCESS_CLIENT_ID_PREPROD_PT
npm run test:pt:preprod -- --headed --workers=1

# Portugal production - uses CF_ACCESS_CLIENT_ID_PRODUCTION_PT
npm run test:pt -- --headed --workers=1
```

### Setting Up Credentials

**1. Create `.env` file** (gitignored, never commit):

```bash
# Spain - Preprod & Lab
CF_ACCESS_CLIENT_ID_PREPROD=your_spain_client_id.access
CF_ACCESS_CLIENT_SECRET_PREPROD=your_spain_client_secret
CF_ACCESS_CLIENT_ID_LAB=your_spain_client_id.access
CF_ACCESS_CLIENT_SECRET_LAB=your_spain_client_secret

# Portugal - Production, Preprod & Lab
CF_ACCESS_CLIENT_ID_PRODUCTION_PT=your_portugal_prod_client_id.access
CF_ACCESS_CLIENT_SECRET_PRODUCTION_PT=your_portugal_prod_client_secret
CF_ACCESS_CLIENT_ID_PREPROD_PT=your_portugal_preprod_client_id.access
CF_ACCESS_CLIENT_SECRET_PREPROD_PT=your_portugal_preprod_client_secret
CF_ACCESS_CLIENT_ID_LAB_PT=your_portugal_lab_client_id.access
CF_ACCESS_CLIENT_SECRET_LAB_PT=your_portugal_lab_client_secret
```

**2. Request credentials** from infrastructure team with these details:

- **Cloudflare Access Domain:** `uci-pt.cloudflareaccess.com` (Portugal), `cinesa-es.cloudflareaccess.com` (Spain)
- **Protected URLs:** List specific environment URLs
- **Purpose:** Automated testing via Playwright

**3. Run tests with Cloudflare:**

```bash
# Always use headed mode and workers=1 for Cloudflare environments
npm run test:es:preprod -- --headed --workers=1
npm run test:pt:preprod -- --grep '@smoke' --headed --workers=1
npm run test:it:lab -- --grep '@critical' --headed --workers=1
```

### Credential Lookup Priority

The system looks for credentials in this order:

1. **Per-deployment:** `CF_ACCESS_CLIENT_ID_PREPROD_PT` (most specific)
2. **Per-environment:** `CF_ACCESS_CLIENT_ID_PREPROD` (fallback)
3. **Generic:** `CF_ACCESS_CLIENT_ID` (last resort)

### Troubleshooting Cloudflare

**Issue:** Tests show Cloudflare challenge page

**Solutions:**

1. **Verify credentials in `.env`:**

   ```bash
   cat .env | grep CF_ACCESS
   ```

2. **Check environment normalization:**

   - `preprod-pt` → `PREPROD_PT` (correct)
   - Hyphens are converted to underscores automatically

3. **Run diagnostic test:**

   ```bash
   TEST_ENV=preprod-pt npx playwright test tests/cinesa/cloudflare/check-portugal-preprod.spec.ts --project='cloudflare-only' --headed
   ```

4. **Contact infrastructure team** if credentials are invalid or expired

See [docs/CLOUDFLARE_HANDLING.md](./docs/CLOUDFLARE_HANDLING.md) for detailed troubleshooting.

## 🎯 Roadmap

### ✅ Completed (Q4 2024)

- **Multi-Region Support**: Spain, Portugal, Italy with standardized scripts
- **Cloudflare Integration**: Automatic credentials injection per region
- **Standardized NPM Scripts**: 90% reduction in script duplication
- **Portugal Configuration**: Full support for `ucicinemas.pt`

### Immediate Goals (Q1 2025)

- **Valid Portugal Credentials**: Obtain working Cloudflare Access tokens
- **Performance Testing**: Load time benchmarks and monitoring
- **Visual Regression**: Automated screenshot comparison
- **API Testing**: Backend service validation
- **CI/CD Integration**: Azure DevOps pipeline with multi-region support

### Future Enhancements (2025-2026)

- **Additional Regions**: France, Germany, other European markets
- **AI-Powered Testing**: Intelligent test generation and maintenance
- **Advanced Analytics**: Predictive quality metrics
- **Mobile App Testing**: Native mobile application support
- **Legacy Script Deprecation**: Remove old scripts in v2.0.0

## 🐛 Troubleshooting

### Common Issues

#### Installation Problems

```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npx playwright install
```

#### Test Execution Issues

```bash
# Debug mode
npm run test:debug             # Step-by-step debugging
npm run test:trace             # Trace viewer
npm run test:record            # Record new interactions
```

#### Browser Issues

```bash
# Reinstall browsers
npx playwright install --force
npx playwright install-deps   # Install system dependencies
```

### Getting Help

1. **Check Documentation**: Review [docs/](./docs/) directory
2. **Search Issues**: Check existing GitHub issues
3. **Create Issue**: Provide detailed reproduction steps
4. **Contact Team**: Reach out to @fcabanilla for urgent matters

## 📞 Support & Contact

- **Maintainer**: Federico Cabanilla (@fcabanilla)
- **Repository**: [playwright-template](https://github.com/fcabanilla/playwright-template)
- **Issues**: [GitHub Issues](https://github.com/fcabanilla/playwright-template/issues)

---

**Last Updated**: November 4, 2025  
**Version**: 1.1.0 - Multi-Region Standardization

**Major Changes in 1.1.0:**

- 🌍 **Portugal Support**: Full UCI Cinemas Portugal integration
- 🎯 **Standardized Scripts**: New `test:es`, `test:pt`, `test:it` pattern
- 🔐 **Cloudflare Auto-Injection**: Automatic credential handling per region
- 📚 **Enhanced Documentation**: New guides for multi-region testing
- 🧹 **90% Script Reduction**: From 166+ to ~20 base scripts with dynamic flags

---

> **Available in other languages:**
>
> - **English** (current) | [Español](./README.es.md)
