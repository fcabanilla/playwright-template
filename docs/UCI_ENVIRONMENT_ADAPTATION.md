# UCI Environment Configuration Adaptation

**Branch:** `feat/uci-environment-config`  
**Date:** 3 de octubre de 2025  
**Status:** ✅ Completed

## 📋 Overview

This document describes the adaptation of UCI to follow the same environment configuration pattern as Cinesa, ensuring consistency across both namespaces in the multi-cinema testing framework.

## 🎯 Objectives

1. **Consistency**: Make UCI use the same environment configuration pattern as Cinesa
2. **Flexibility**: Support multiple environments (production, staging, development)
3. **Runtime Override**: Allow URL overrides via environment variables
4. **Backward Compatibility**: Maintain existing test functionality

## 🔄 Changes Made

### 1. Updated UCI Fixtures (`fixtures/uci/playwright.fixtures.ts`)

**Before:**
```typescript
navbar: async ({ page }, use) => {
  const navbar = new Navbar(page);
  await use(navbar);
},
```

**After:**
```typescript
navbar: async ({ page }, use) => {
  const env = process.env.TEST_ENV as UCIEnvironment || 'production';
  const config = getUCIConfig(env);
  const navbar = new Navbar(page, config.baseUrl);
  await use(navbar);
},
```

**Impact:**
- Now reads `TEST_ENV` environment variable
- Injects environment-specific `baseUrl` into Navbar
- Matches Cinesa pattern exactly

### 2. Updated UCI Navbar (`pageObjectsManagers/uci/navbar/navbar.page.ts`)

**Changes:**
- Added optional `baseUrl` parameter to constructor
- Added private `url` property to store the injected baseUrl
- Modified `navigateToHome()` to use `this.url` instead of `this.urls.base`
- Modified `navigateToHomeWithCloudflareHandling()` to use `this.url`

**Before:**
```typescript
constructor(page: Page) {
  this.webActions = new WebActions(page);
  this.selectors = navbarSelectors;
  this.urls = getUCIUrls();
}

async navigateToHome(): Promise<void> {
  await this.webActions.navigateTo(this.urls.base);
}
```

**After:**
```typescript
constructor(page: Page, baseUrl?: string) {
  this.webActions = new WebActions(page);
  this.selectors = navbarSelectors;
  this.urls = getUCIUrls();
  this.url = baseUrl || this.urls.base;  // Injected or default
}

async navigateToHome(): Promise<void> {
  await this.webActions.navigateTo(this.url);  // Uses injected URL
}
```

**Backward Compatibility:**
- `baseUrl` parameter is optional
- Falls back to `this.urls.base` if not provided
- Existing code without fixtures still works

## 🏗️ Architecture Alignment

### Before Adaptation

```
UCI Pattern:
├─ Navbar gets URLs from getUCIUrls() directly
├─ No environment configuration injection
├─ Always uses production URLs
└─ No TEST_ENV support

Cinesa Pattern:
├─ Navbar receives baseUrl from fixtures
├─ Fixtures read TEST_ENV and inject config
├─ Supports multiple environments
└─ Allows runtime URL overrides
```

### After Adaptation

```
Both UCI & Cinesa:
├─ Navbar receives baseUrl from fixtures
├─ Fixtures read TEST_ENV and inject config
├─ Supports multiple environments (production, staging, development)
├─ Allows runtime URL overrides via environment variables
└─ Consistent pattern across namespaces
```

## 🚀 Usage Examples

### Run Tests in Different Environments

```bash
# Production (default)
npm run test:uci:navbar

# Staging
TEST_ENV=staging npm run test:uci:navbar

# Development
TEST_ENV=development npm run test:uci:navbar
```

### Runtime URL Overrides

```bash
# Override base URL
UCI_BASE_URL=https://test-server.ucicinemas.it npm run test:uci:navbar

# Multiple overrides
TEST_ENV=staging \
UCI_BASE_URL=https://custom-staging.ucicinemas.it \
UCI_TIMEOUT_PAGE=60000 \
npm run test:uci:navbar
```

### Using in Tests

```typescript
// Test automatically uses configured environment
test('Navigate to home', async ({ navbar }) => {
  await navbar.navigateToHome();  // Uses baseUrl from TEST_ENV
});
```

## 📊 Configuration Flow

```
┌─────────────────────┐
│ TEST_ENV variable   │
│ (staging/prod/dev)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ getUCIConfig(env)   │
│ Returns config with │
│ baseUrl, timeouts,  │
│ feature flags       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ UCI Fixture         │
│ Creates Navbar with │
│ config.baseUrl      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Navbar constructor  │
│ Stores baseUrl in   │
│ this.url property   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ navigateToHome()    │
│ Uses this.url       │
└─────────────────────┘
```

## ✅ Benefits

1. **Consistency**: UCI and Cinesa now use identical configuration patterns
2. **Flexibility**: Easy to test against different environments
3. **Maintainability**: Single source of truth for environment configuration
4. **CI/CD Ready**: Easy to configure in pipelines with environment variables
5. **Developer Experience**: Consistent API across both namespaces

## 🔍 Testing the Changes

### Verify Environment Configuration

```bash
# Test production (default)
npm run test:uci:navbar -- --grep "Navigate to home"

# Test staging
TEST_ENV=staging npm run test:uci:navbar -- --grep "Navigate to home"

# Test with override
UCI_BASE_URL=https://localhost:3000 npm run test:uci:navbar -- --grep "Navigate to home"
```

### Expected Behavior

- Without `TEST_ENV`: Uses production URLs
- With `TEST_ENV=staging`: Uses staging URLs from config
- With `UCI_BASE_URL`: Overrides baseUrl regardless of TEST_ENV

## 📝 Migration Notes

### For Existing Tests
- **No changes required** in test files
- Tests automatically use the new configuration system
- Fixtures handle all configuration injection

### For New Tests
- Follow the same pattern as existing tests
- Use fixtures to get pre-configured page objects
- No need to manually configure URLs

### For CI/CD Pipelines
- Set `TEST_ENV` environment variable to target environment
- Use `UCI_BASE_URL` for custom URLs if needed
- All timeouts and features can be overridden via env vars

## 🔗 Related Files

- `config/environments.ts` - Environment configurations
- `config/urls.ts` - URL generation functions
- `fixtures/uci/playwright.fixtures.ts` - UCI fixtures with config injection
- `pageObjectsManagers/uci/navbar/navbar.page.ts` - Updated Navbar
- `docs/URL_CONFIGURATION.md` - General URL configuration guide

## 🎉 Conclusion

UCI now follows the same environment configuration pattern as Cinesa, providing:
- Unified configuration approach across namespaces
- Better environment management
- Improved flexibility for testing
- Consistent developer experience

The adaptation maintains full backward compatibility while adding powerful new capabilities for environment-specific testing.

---

**Next Steps:**
1. Test the changes across all environments
2. Update CI/CD pipelines to use new environment variables
3. Consider extending this pattern to other page objects if needed
