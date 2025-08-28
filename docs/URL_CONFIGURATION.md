# URL Configuration Management

This document explains how to manage and configure URLs across different environments and namespaces in the multi-cinema testing framework.

## Overview

The framework uses a centralized configuration system that allows for:

- Environment-specific URLs (production, staging, development)
- Runtime URL overrides via environment variables
- Namespace separation (Cinesa vs UCI)
- Easy maintenance and updates

## Files Structure

```
config/
├── environments.ts    # Environment configurations and feature flags
└── urls.ts           # URL generation and navigation paths

tests/[namespace]/*/
└── *.data.ts         # Test-specific data using centralized URLs
```

## Configuration Files

### `config/environments.ts`

Defines environment-specific configurations including:

- Base URLs for each environment
- Timeout settings
- Feature flags (analytics, modals, cookies)
- Runtime override support

### `config/urls.ts`

Generates navigation URLs based on environment configuration:

- Main navigation paths
- Footer links
- Authentication URLs
- App download links
- Social media links

## Usage Examples

### Basic Usage in Page Objects

```typescript
import { getUCIUrls } from '../../../config/urls';

export class Navbar {
  constructor(page: Page) {
    this.page = page;
    this.url = getUCIUrls().base;
  }
}
```

### Usage in Test Data Files

```typescript
import { getUCIUrls } from '../../../config/urls';

const urls = getUCIUrls();

export const testUrls = {
  cinema: urls.navigation.cinemas,
  movies: urls.navigation.movies,
  // ... other URLs
};
```

## Environment Configuration

### Default Environments

1. **Production**: Live websites

   - Cinesa: `https://www.cinesa.es`
   - UCI: `https://www.ucicinemas.it`

2. **Staging**: Pre-production environments

   - Cinesa: `https://staging.cinesa.es`
   - UCI: `https://staging.ucicinemas.it`

3. **Development**: Development environments
   - Cinesa: `https://dev.cinesa.es`
   - UCI: `https://dev.ucicinemas.it`

### Selecting Environment

Set the `TEST_ENV` environment variable:

```bash
# Run against staging
TEST_ENV=staging npm run test:uci:navbar

# Run against development
TEST_ENV=development npm run test:cinesa:navbar
```

## Runtime URL Overrides

You can override any URL at runtime using environment variables:

### Base URL Override

```bash
# Override UCI base URL
UCI_BASE_URL=https://my-test-server.com npm run test:uci:navbar

# Override Cinesa base URL
CINESA_BASE_URL=https://localhost:3000 npm run test:cinesa:navbar
```

### API URL Override

```bash
# Override API URLs
UCI_API_URL=https://api-test.ucicinemas.it npm run test:uci
CINESA_API_URL=https://api-staging.cinesa.es npm run test:cinesa
```

### Timeout Overrides

```bash
# Increase timeouts for slower environments
UCI_TIMEOUT_PAGE=60000 UCI_TIMEOUT_MODAL=30000 npm run test:uci:navbar
```

### Feature Flag Overrides

```bash
# Disable promotional modals for testing
UCI_FEATURE_MODALS=false npm run test:uci:navbar

# Disable analytics tracking
CINESA_FEATURE_ANALYTICS=false npm run test:cinesa
```

## Environment Variables Reference

### Cinesa Namespace

| Variable                   | Description            | Default              |
| -------------------------- | ---------------------- | -------------------- |
| `CINESA_BASE_URL`          | Base URL for Cinesa    | Environment-specific |
| `CINESA_API_URL`           | API URL for Cinesa     | Not set              |
| `CINESA_TIMEOUT_PAGE`      | Page load timeout (ms) | 30000                |
| `CINESA_TIMEOUT_ELEMENT`   | Element timeout (ms)   | 10000                |
| `CINESA_TIMEOUT_MODAL`     | Modal timeout (ms)     | 15000                |
| `CINESA_FEATURE_ANALYTICS` | Enable analytics       | true                 |
| `CINESA_FEATURE_MODALS`    | Enable modal handling  | true                 |
| `CINESA_FEATURE_COOKIES`   | Enable cookie handling | true                 |

### UCI Namespace

| Variable                | Description            | Default              |
| ----------------------- | ---------------------- | -------------------- |
| `UCI_BASE_URL`          | Base URL for UCI       | Environment-specific |
| `UCI_API_URL`           | API URL for UCI        | Not set              |
| `UCI_TIMEOUT_PAGE`      | Page load timeout (ms) | 30000                |
| `UCI_TIMEOUT_ELEMENT`   | Element timeout (ms)   | 10000                |
| `UCI_TIMEOUT_MODAL`     | Modal timeout (ms)     | 15000                |
| `UCI_FEATURE_ANALYTICS` | Enable analytics       | true                 |
| `UCI_FEATURE_MODALS`    | Enable modal handling  | true                 |
| `UCI_FEATURE_COOKIES`   | Enable cookie handling | true                 |

## Adding New URLs

### For Navigation URLs

1. Update the `NavigationUrls` interface in `config/urls.ts`
2. Add the new URL to the appropriate namespace function
3. Update test data files to use the new URL

### For New Environments

1. Add the new environment to `environments.ts`
2. Update the type definitions
3. Add any specific configuration needed

## Best Practices

1. **Always use centralized configuration**: Don't hardcode URLs in page objects or tests
2. **Use environment variables for runtime overrides**: This allows flexibility without code changes
3. **Document new URLs**: Update this file when adding new URLs or environments
4. **Test with different environments**: Ensure tests work across all configured environments
5. **Use descriptive variable names**: Make it clear what each URL is for

## Examples

### Testing Against Local Development Server

```bash
# Set up environment
UCI_BASE_URL=http://localhost:3000 \
UCI_FEATURE_MODALS=false \
UCI_TIMEOUT_PAGE=10000 \
npm run test:uci:navbar
```

### CI/CD Pipeline Configuration

```yaml
# Example GitHub Actions configuration
env:
  TEST_ENV: staging
  UCI_BASE_URL: ${{ secrets.UCI_STAGING_URL }}
  CINESA_BASE_URL: ${{ secrets.CINESA_STAGING_URL }}
  UCI_FEATURE_ANALYTICS: false
  CINESA_FEATURE_ANALYTICS: false
```

### Load Testing Configuration

```bash
# Use production URLs with disabled features for performance testing
TEST_ENV=production \
UCI_FEATURE_MODALS=false \
UCI_FEATURE_COOKIES=false \
UCI_TIMEOUT_PAGE=5000 \
npm run test:uci:performance
```
