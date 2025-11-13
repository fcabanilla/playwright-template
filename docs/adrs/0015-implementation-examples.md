# ADR-0015 Implementation Examples

## Before & After Migration Guide

This document provides concrete examples of how ADR-0015 standardizes Allure step messages.

---

## Navigation

### ❌ BEFORE (Inconsistent)

```typescript
// POM was passing custom messages
await webActions.navigateTo(
  'https://www.cinesa.es/peliculas',
  'Navigate to Movies page'
);
await webActions.navigateTo('https://www.cinesa.es/cines', 'Go to Cinemas');
await webActions.navigateTo(config.baseUrl);

// Allure steps were:
// "Navigate to Movies page"
// "Go to Cinemas"
// "Navigate to https://www.cinesa.es"
```

### ✅ AFTER (Consistent)

```typescript
// POM just calls the method
await webActions.navigateTo('https://www.cinesa.es/peliculas');
await webActions.navigateTo('https://www.cinesa.es/cines');
await webActions.navigateTo(config.baseUrl);

// Allure steps are:
// "[NAV] Goto | URL=/peliculas | Env=production"
// "[NAV] Goto | URL=/cines | Env=production"
// "[NAV] Goto | URL=/ | Env=production"
```

**Benefits:**

- ✅ Grep-friendly: Search for `[NAV]` to find all navigation steps
- ✅ Consistent format: Always shows URL path and environment
- ✅ No POM overhead: No need to construct messages manually

---

## Click Actions

### ❌ BEFORE (Verbose, POM builds messages)

```typescript
// POM
async clickLogo() {
  await this.webActions.click(this.selectors.logo, 'Click on Cinesa logo');
}

async clickMoviesMenu() {
  await this.webActions.click(this.selectors.movies, 'Click on Movies menu item');
}

// Allure steps:
// "Click on Cinesa logo"
// "Click on Movies menu item"
```

### ✅ AFTER (Clean, centralized)

```typescript
// POM - just passes selector and logical name
async clickLogo() {
  await this.webActions.click(this.selectors.logo, 'logo');
}

async clickMoviesMenu() {
  await this.webActions.click(this.selectors.movies, 'moviesMenu');
}

// Allure steps:
// "[ACT] Click | Target=logo"
// "[ACT] Click | Target=moviesMenu"
```

**Benefits:**

- ✅ Grep-friendly: Search for `[ACT] Click.*logo` to find logo clicks
- ✅ Traceable: `Target=logo` maps directly to `selectors.logo` in code
- ✅ Less code: No verbose message construction in POMs

---

## Fill Form Fields

### ❌ BEFORE (Insecure, inconsistent masking)

```typescript
// POM
async fillEmail(email: string) {
  await this.webActions.fill(this.selectors.emailInput, email, 'Fill email field');
}

async fillPassword(password: string) {
  await this.webActions.fill(this.selectors.passwordInput, password, 'Fill password');
}

// Allure steps exposed sensitive values:
// "Fill email field" (no value shown)
// "Fill password" (sometimes value leaked!)
```

### ✅ AFTER (Secure by default)

```typescript
// POM - no message, automatic masking
async fillEmail(email: string) {
  await this.webActions.fill(this.selectors.emailInput, email, 'emailInput');
}

async fillPassword(password: string) {
  await this.webActions.fill(this.selectors.passwordInput, password, 'passwordInput');
}

// Allure steps:
// "[ACT] Fill | Field=emailInput | Value=••••••••••••.com"
// "[ACT] Fill | Field=passwordInput | Value=••••••ord123"
```

**Benefits:**

- ✅ Security: ALL values masked automatically (shows last 4 chars)
- ✅ Traceable: `Field=emailInput` maps to `selectors.emailInput`
- ✅ Consistent: Same format across all fill operations

---

## Wait Operations

### ❌ BEFORE (No timeout visibility)

```typescript
// POM
async waitForMovieCard() {
  await this.webActions.waitForVisible(
    this.selectors.movieCard,
    10000,
    'Wait for movie card to appear'
  );
}

// Allure step:
// "Wait for movie card to appear" (timeout not visible)
```

### ✅ AFTER (Timeout explicit)

```typescript
// POM
async waitForMovieCard() {
  await this.webActions.waitForVisible(this.selectors.movieCard, 10000, 'movieCard');
}

// Allure step:
// "[WAIT] Visible | Target=movieCard | Timeout=10.0s"
```

**Benefits:**

- ✅ Timeout visible: Easy to spot slow operations
- ✅ Grep-friendly: Find all waits with `[WAIT]`
- ✅ Debug-friendly: Know exactly what element and how long

---

## Consent Cookies

### ❌ BEFORE (Custom messages per call)

```typescript
// Fixture
await webActions.applyConsentSeedsFor(
  config.baseUrl,
  `[Fixture] Pre-seeding consent cookies for ${config.baseUrl}`
);

// Allure step:
// "[Fixture] Pre-seeding consent cookies for https://www.cinesa.es"
// (parameters buried in Allure params)
```

### ✅ AFTER (Standardized)

```typescript
// Fixture - just the URL
await webActions.applyConsentSeedsFor(config.baseUrl);

// Allure step:
// "[DATA] Apply consent seeds | Host=www.cinesa.es | Status=Seeds applied (3)"
```

**Benefits:**

- ✅ Prefix `[DATA]` groups data operations
- ✅ Status inline: Know immediately if seeds applied or skipped
- ✅ No custom message needed

---

## Real-World Workflow Example

### ❌ BEFORE (Allure report had noise)

```
Allure Steps:
1. Navigate to home page
2. Click on cookie accept button
3. Wait for navbar to be visible
4. Click on Movies menu
5. Fill search field with text
6. Click on first movie card
```

**Problems:**

- Hard to grep (mix of "Click", "click", "Click on")
- No field names visible (what was filled?)
- No timeout info (how long did we wait?)

### ✅ AFTER (Clean, grep-friendly, traceable)

```
Allure Steps:
1. [NAV] Goto | URL=/ | Env=production
2. [ACT] Click | Target=cookieAcceptButton
3. [WAIT] Visible | Target=navbar | Timeout=5.0s
4. [ACT] Click | Target=moviesMenu
5. [ACT] Fill | Field=searchInput | Value=••••••rman
6. [ACT] Click | Target=movieCard
```

**Benefits:**

- ✅ Grep `[NAV]` → All navigation
- ✅ Grep `[ACT] Click.*moviesMenu` → Specific click
- ✅ Grep `[WAIT].*Timeout=10` → Long waits
- ✅ Grep `[ACT] Fill` → All form inputs
- ✅ Every target maps to selectors file

---

## Migration Checklist for POMs

When refactoring existing Page Objects:

### 1. **Remove custom stepMessage parameters**

```diff
- await this.webActions.click(this.selectors.logo, 'Click on logo');
+ await this.webActions.click(this.selectors.logo, 'logo');
```

### 2. **Pass selector key name as second parameter**

```diff
- await this.webActions.fill(this.selectors.emailInput, email);
+ await this.webActions.fill(this.selectors.emailInput, email, 'emailInput');
```

### 3. **Remove wait message, add target name**

```diff
- await this.webActions.waitForVisible(this.selectors.modal, 5000, 'Wait for modal');
+ await this.webActions.waitForVisible(this.selectors.modal, 5000, 'modal');
```

### 4. **Navigation - just URL**

```diff
- await this.webActions.navigateTo(url, 'Navigate to Movies page');
+ await this.webActions.navigateTo(url);
```

---

## Testing the Changes

Run a test and check Allure report:

```bash
npm run test:cinesa:navbar
npm run report
```

**Expected Allure Steps Format:**

```
✅ [NAV] Goto | URL=/peliculas | Env=production
✅ [ACT] Click | Target=cookieAcceptButton
✅ [WAIT] Visible | Target=navbar | Timeout=5.0s
✅ [ACT] Fill | Field=searchInput | Value=••••••rman
✅ [ACT] Click | Target=submitButton
```

---

## FAQ

### Q: What if I don't have a logical selector name?

**A:** WebActions falls back to the CSS selector:

```typescript
await webActions.click('.btn-primary'); // No second param
// Allure step: "[ACT] Click | Target=.btn-primary"
```

But **prefer** extracting selector to `*.selectors.ts` file.

### Q: Can I override the message in special cases?

**A:** No. The whole point is **consistency**. If you need custom context, use test-level `allure.step()`:

```typescript
await allure.step('User completes signup flow', async () => {
  await signup.fillEmail(email);
  await signup.fillPassword(password);
  await signup.clickSubmit();
});
```

### Q: What about assertions?

**A:** Assertions use `[ASSERT]` prefix (not implemented yet):

```typescript
// Future:
await webActions.assertText(selector, 'expectedText', 'titleElement');
// "[ASSERT] TextEquals | Target=titleElement | Expected="expectedText"
```

---

## Summary

| Aspect           | Before                      | After                              |
| ---------------- | --------------------------- | ---------------------------------- |
| **Consistency**  | ❌ Free-form messages       | ✅ Fixed taxonomy                  |
| **Greppability** | ❌ Hard to search           | ✅ Prefix-based (`[NAV]`, `[ACT]`) |
| **Security**     | ⚠️ Manual masking           | ✅ Auto-masked by default          |
| **Traceability** | ⚠️ Selectors buried         | ✅ Target maps to selectors file   |
| **POM Overhead** | ❌ Build messages manually  | ✅ Just pass selector key          |
| **Maintenance**  | ❌ Update messages per test | ✅ Centralized in WebActions       |

---

**Next Steps:**

- Incrementally migrate existing POMs (start with critical flows)
- Add lint rule to enforce `[PREFIX]` format in step titles
- Extend to assertions and data operations
