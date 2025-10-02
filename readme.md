# 🎬 Cinema Multi-Platform Test Automation Framework

End-to-end test automation framework for multiple cinema chains using **Playwright** with **TypeScript**. Supports **Cinesa** (Spain) and **UCI Cinemas** (Italy) with scalable architecture for future expansions.

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
├── 📁 test-results/          # Test execution artifacts
├── 📁 allure-report/         # Visual reports (generated)
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
# Complete tests per platform
npm run test:cinesa              # All Cinesa tests
npm run test:uci                 # All UCI tests

# Tests by functionality (Cinesa)
npm run test:navbar              # Navigation
npm run test:movies              # Movies
npm run test:cinemas             # Cinemas
npm run test:login               # Authentication
npm run test:booking             # Booking flow

# Tests by tags
npm run test:smoke               # Critical smoke tests
npm run test:regression          # Complete regression
npm run test:fast                # Quick execution tests
```

#### Reports and Analysis

```bash
# Generate and view reports
npm run test:report              # Open Allure report
npm run test:html                # Generate HTML report

# Development and debugging
npm run test:debug               # Debug mode
npm run test:headed              # With browser UI
npm run test:trace               # With trace recording
```

## 🎯 Key Features

### Multi-Platform Architecture

- **Cinesa Platform**: Full support for Spanish market
- **UCI Platform**: Complete Italian market coverage
- **Shared Components**: Reusable across platforms
- **Scalable Design**: Easy addition of new cinema chains

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
- **Allure Reporting**: Rich visual test reports

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
    bookButton: '.book-now-button'
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
  }
});
```

### Multi-Environment Support

```typescript
// Environment configuration
export const environments = {
  production: {
    cinesa: 'https://www.cinesa.es',
    uci: 'https://www.uci.it'
  },
  staging: {
    cinesa: 'https://staging.cinesa.es',
    uci: 'https://staging.uci.it'
  }
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

#### Cinesa Platform

- Movie browsing and filtering
- Cinema location selection
- Seat picker functionality
- Payment flow validation
- User account management
- Mobile responsive testing

#### UCI Platform
- Film catalog navigation
- Theater selection process
- Booking confirmation flow
- Multi-language support
- Payment method validation
- Accessibility compliance

## 🌍 Environment Configuration

### Test Environments

- **Production**: Live cinema platforms (read-only tests)
- **Staging**: Pre-production validation environment
- **Development**: Development and debugging environment

### Environment Variables

```bash
# Set target environment
export TEST_ENV=production    # production | staging | development
export BROWSER=chromium       # chromium | firefox | webkit
export WORKERS=4              # Parallel execution workers
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

- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System design and patterns
- **[Style Guide](./docs/STYLEGUIDE.md)** - Coding conventions and best practices
- **[ADRs](./docs/adrs/)** - Architectural Decision Records
- **[Contributing](./CONTRIBUTING.md)** - Contribution workflow and guidelines

## 🔒 Authentication & Security

### Test User Management

- **Dedicated test accounts** for each environment
- **Session state management** for authenticated flows
- **Secure credential storage** (environment variables)

### Cloudflare Handling

Special handling for Cloudflare-protected environments:

```bash
# Generate authenticated session state
npm run auth:generate          # Interactive authentication
npm run test:authenticated     # Use saved session state
```

## 🎯 Roadmap

### Immediate Goals (Q4 2025)

- **Cloudflare Integration**: Seamless challenge handling
- **Performance Testing**: Load time benchmarks and monitoring
- **Visual Regression**: Automated screenshot comparison
- **API Testing**: Backend service validation

### Future Enhancements (2026)
- **Additional Platforms**: Expansion to other cinema chains
- **AI-Powered Testing**: Intelligent test generation and maintenance
- **Advanced Analytics**: Predictive quality metrics
- **Mobile App Testing**: Native mobile application support

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

**Last Updated**: October 2, 2025  
**Version**: 1.0.0  

---

> **Available in other languages:**
>
> - **English** (current) | [Español](./README.es.md)
