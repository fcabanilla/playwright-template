# 🤝 Contributing Guide

Thank you for your interest in contributing to the **Cinema Multi-Platform Test Automation Framework**. This guide will help you understand our contribution process and project best practices.

## 🎯 Welcome Contributions

- **🐛 Bug fixes** in existing tests
- **✨ New test cases** for uncovered functionalities
- **🏗️ Page Objects improvements** and architecture
- **📝 Documentation improvements**
- **🚀 Performance optimizations**
- **🔧 Development tools** and automation

## 🌊 Pull Request Workflow

### 1. Preparation

```bash
# Fork repository and clone your fork
git clone https://github.com/YOUR-USERNAME/playwright-template.git
cd playwright-template

# Configure upstream
git remote add upstream https://github.com/fcabanilla/playwright-template.git

# Install dependencies
npm install
npx playwright install
```

### 2. Create Feature Branch

```bash
# Create branch from updated main
git checkout main
git pull upstream main
git checkout -b feature/descriptive-name

# Or for bugs
git checkout -b fix/bug-description

# Or for documentation
git checkout -b docs/improved-area
```

### 3. Branch Conventions

| Type          | Prefix      | Example                          | Description                |
| ------------- | ----------- | -------------------------------- | -------------------------- |
| Feature       | `feature/`  | `feature/uci-payment-flow`       | New functionality          |
| Fix           | `fix/`      | `fix/navbar-selector-update`     | Bug fixes                  |
| Documentation | `docs/`     | `docs/api-testing-guide`         | Documentation improvements |
| Refactor      | `refactor/` | `refactor/page-object-structure` | Code restructuring         |
| Performance   | `perf/`     | `perf/test-execution-speed`      | Optimizations              |
| Chore         | `chore/`    | `chore/update-dependencies`      | Maintenance tasks          |

### 4. Development

#### PR Size Guidelines

- **Maximum 400 lines** of changes per PR
- **One concept per PR** - don't mix functionalities
- **Tests included** for all new functionality

#### Commit Structure

We follow **Conventional Commits** for clear messages and automation:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

#### Commit Examples

```bash
# Features
feat(cinesa): add complete payment flow test
feat(uci): implement seat selection page object
feat(core): add overlay handling in WebActions

# Fixes
fix(navbar): update selectors after redesign
fix(seatpicker): correct timeout in multiple selection
fix(config): resolve preprod environment configuration

# Documentation
docs(readme): update installation guide
docs(contributing): add page object examples
docs(adr): document Allure 3 usage decision

# Refactoring
refactor(fixtures): simplify dependency injection
refactor(assertions): move assertions to dedicated classes

# Performance
perf(tests): reduce execution time by 30%
perf(selectors): optimize wait strategies

# Chores
chore(deps): update Playwright to v1.50.1
chore(lint): configure ESLint for strict TypeScript
```

### 5. Local Checks Before PR

#### Tests and Linting

```bash
# 1. Run linting
npm run lint

# 2. Run relevant tests
npm run test:cinesa:navbar  # For navbar changes
npm run test:uci:smoke      # For UCI changes

# 3. Run complete suite (recommended)
npm run test:cinesa
npm run test:uci

# 4. Generate report
npm run report:generate
```

#### Mandatory Verifications

```bash
# Verify no TypeScript errors
npx tsc --noEmit

# Verify tests pass
npm test

# Verify code format
npm run lint
```

### 6. Create Pull Request

#### PR Template

```markdown
## 📋 Description

Clear and concise description of implemented changes.

## 🎯 Change Type

- [ ] 🐛 Bug fix (change that fixes an issue)
- [ ] ✨ New feature (change that adds functionality)
- [ ] 💥 Breaking change (fix or feature causing incompatible changes)
- [ ] 📝 Documentation (documentation-only changes)
- [ ] 🎨 Refactoring (changes that don't add functionality or fix bugs)
- [ ] ⚡ Performance (changes that improve performance)
- [ ] 🧪 Tests (adding missing tests or correcting existing ones)

## 🧪 Testing Performed

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual tests performed (describe which ones)
- [ ] Allure report generated and reviewed

## 📝 Checklist

- [ ] My code follows project conventions
- [ ] I have performed self-review of my code
- [ ] I have commented complex code when necessary
- [ ] I have updated relevant documentation
- [ ] My changes don't generate new warnings
- [ ] I have added tests that prove my fix/feature
- [ ] New and existing tests pass locally

## 🔗 Related Issues

Closes #(issue)

## 📷 Screenshots (if applicable)

If there are visual changes, include before/after screenshots.

## 📚 Additional Documentation

Links to relevant documentation or additional explanations.
```

#### PR Labels

- `scope:cinesa` - Cinesa-specific changes
- `scope:uci` - UCI-specific changes
- `scope:core` - Core functionality changes
- `type:feature` - New functionality
- `type:bugfix` - Error correction
- `type:docs` - Documentation changes
- `priority:high` - High priority
- `priority:medium` - Medium priority
- `priority:low` - Low priority

### 7. Code Review

#### Approval Criteria

- **2 approvals minimum** for changes to `main`
- **1 approval minimum** for changes to `develop`
- **Owner approval required** for architectural changes

#### Review Process

1. **Automated checks** must pass (linting, tests)
2. **Code review** by at least one maintainer
3. **Testing verification** in test environment
4. **Documentation review** if there are doc changes

## 🚨 Issues Policy

### Create an Issue

#### Bug Report

```markdown
**🐛 Bug Description**
Clear and concise description of the problem.

**🔄 Steps to Reproduce**

1. Go to '...'
2. Click on '...'
3. See error

**📋 Expected Behavior**
Description of what should happen.

**📷 Screenshots**
If applicable, add screenshots.

**🖥️ Environment**

- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**📝 Additional Context**
Any other relevant information.
```

#### Feature Request

```markdown
**✨ Feature Description**
Clear description of the proposed functionality.

**🎯 Problem It Solves**
Explain what problem this functionality solves.

**💡 Proposed Solution**
Description of how it should work.

**🔄 Alternatives Considered**
Other alternatives you considered.

**📋 Acceptance Criteria**

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

### Issue Triage

#### Priority Labels

- 🔥 `priority:critical` - Blocks main functionality
- ⚠️ `priority:high` - Affects important functionality
- 📋 `priority:medium` - General improvement
- 💡 `priority:low` - Nice to have

#### Type Labels

- 🐛 `type:bug` - Error in existing code
- ✨ `type:enhancement` - New functionality
- 📝 `type:documentation` - Documentation improvements
- ❓ `type:question` - Question about the project
- 🏗️ `type:architecture` - Architectural changes

#### Status Labels

- 🔍 `status:investigating` - Investigating the problem
- 📋 `status:planned` - Planned for development
- 🔄 `status:in-progress` - In active development
- ⏳ `status:blocked` - Blocked by dependencies
- ✅ `status:ready-for-review` - Ready for review

## 🎯 Code Conventions

### TypeScript

```typescript
// ✅ Good: Clear interfaces and explicit types
interface MovieSelectors {
  readonly movieCard: string;
  readonly movieTitle: string;
  readonly movieRating: string;
}

// ✅ Good: JSDoc documentation
/**
 * Handles movie selection and validation for cinema platforms
 * @param movieId - Unique identifier for the movie
 * @returns Promise resolving to movie details
 */
async selectMovie(movieId: string): Promise<MovieDetails> {
  // Implementation
}

// ❌ Bad: any types and lack of documentation
async selectMovie(movieId: any) {
  // Implementation
}
```

### Page Objects

```typescript
// ✅ Good: Well-structured Page Object
export class MoviePage {
  constructor(private page: Page) {}

  private readonly selectors = {
    movieCard: '[data-testid="movie-card"]',
    movieTitle: '.movie-title',
    bookButton: '.book-button',
  } as const;

  async selectMovie(movieTitle: string): Promise<void> {
    await this.page
      .locator(this.selectors.movieCard)
      .filter({ hasText: movieTitle })
      .click();
  }
}
```

### Tests

```typescript
// ✅ Good: Descriptive tests with clear steps
test.describe('Movie Selection Flow', () => {
  test('should select movie and proceed to seat selection', async ({
    page,
    moviePage,
    seatPage,
  }) => {
    await test.step('Navigate to movies page', async () => {
      await moviePage.navigate();
    });

    await test.step('Select specific movie', async () => {
      await moviePage.selectMovie('Avengers: Endgame');
    });

    await test.step('Verify seat selection page loads', async () => {
      await expect(seatPage.seatMap).toBeVisible();
    });
  });
});
```

## 🔧 Development Tools

### Local Setup

```bash
# Verify setup
npm run lint          # Verify code
npm run test          # Execute tests
npm run report        # View report

# Useful tools
npm run ui            # Playwright UI for debug
npm run codegen       # Generate selectors automatically
```

### Debugging

```typescript
// Debug with pause
await page.pause();

// Debug with screenshots
await page.screenshot({ path: 'debug.png' });

// Debug with logs
console.log('Current URL:', page.url());
```

## 📋 Quality Standards

### Code Coverage

- **Minimum 80%** coverage for new Page Objects
- **Mandatory tests** for all new functionality
- **Regression tests** for bug fixes

### Performance

- **Tests must execute** in less than 5 minutes
- **Optimized Page Objects** with efficient wait strategies
- **Robust selectors** that don't depend on implementation

### Documentation

- **Mandatory JSDoc** for public methods
- **Updated README** for new functionalities
- **Documented ADRs** for architectural decisions

## 🆘 Getting Help

### Communication Channels

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For general questions
- **Pull Request Comments** - For specific feedback

### Contacts

- **Main Maintainer**: @fcabanilla
- **Cinesa Team**: @team-cinesa
- **UCI Team**: @team-uci

### Useful Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://conventionalcommits.org/)
- [Allure Framework](https://docs.qameta.io/allure/)

---

## 🏆 Acknowledgments

We thank all contributors who make this project possible:

- Contribution tracking in [Contributors](../../graphs/contributors)
- Wall of fame in important releases

---

**Thank you for contributing! 🎉** Your help makes this framework better for the entire cinema testing community.

---

> **Available in other languages:**
>
> - [Español](./CONTRIBUTING.es.md) | **English** (current)
