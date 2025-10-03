# Testing UCI Environment Configuration

This guide provides examples and commands to test the new UCI environment configuration system.

## Quick Test Commands

### Test Default (Production) Environment

```bash
npm run test:uci:navbar -- --grep "Navigate to home"
```

### Test Staging Environment

```bash
TEST_ENV=staging npm run test:uci:navbar -- --grep "Navigate to home"
```

### Test Development Environment

```bash
TEST_ENV=development npm run test:uci:navbar -- --grep "Navigate to home"
```

### Test with Custom URL Override

```bash
UCI_BASE_URL=https://my-test-server.ucicinemas.it npm run test:uci:navbar -- --grep "Navigate to home"
```

### Test with Multiple Overrides

```bash
TEST_ENV=staging \
UCI_BASE_URL=https://custom.ucicinemas.it \
UCI_TIMEOUT_PAGE=60000 \
UCI_TIMEOUT_MODAL=30000 \
UCI_FEATURE_MODALS=false \
npm run test:uci:navbar
```

## Verification Steps

### 1. Verify Configuration Loading

Create a simple test to verify the configuration is loaded correctly:

```typescript
import { test, expect } from '../../fixtures/uci/playwright.fixtures';
import { getUCIConfig } from '../../config/environments';

test('Verify UCI environment configuration', async ({ navbar }) => {
  const env = process.env.TEST_ENV || 'production';
  const config = getUCIConfig(env as any);
  
  console.log('Environment:', env);
  console.log('Base URL:', config.baseUrl);
  console.log('Timeouts:', config.timeouts);
  console.log('Features:', config.features);
  
  // Verify navbar is using the correct URL
  await navbar.navigateToHome();
  const currentUrl = await navbar.getCurrentUrl();
  expect(currentUrl).toContain(config.baseUrl.replace('https://', '').replace('http://', ''));
});
```

### 2. Compare with Cinesa

Run both Cinesa and UCI tests to verify consistency:

```bash
# Cinesa staging
TEST_ENV=staging npm run test:cinesa:navbar -- --grep "Navigate to home"

# UCI staging
TEST_ENV=staging npm run test:uci:navbar -- --grep "Navigate to home"
```

Both should use their respective staging URLs.

### 3. Test Environment Variable Priority

Test the priority of environment variables:

```bash
# Base config (staging)
TEST_ENV=staging npm run test:uci:navbar

# Override with UCI_BASE_URL (should use override)
TEST_ENV=staging UCI_BASE_URL=https://override.ucicinemas.it npm run test:uci:navbar
```

The second command should use the override URL, not the staging URL from config.

## Expected Behaviors

### Production (default)

- **URL**: `https://ucicinemas.it`
- **Analytics**: Enabled
- **Modals**: Enabled
- **Timeouts**: Standard (30s page, 10s element, 15s modal)

### Staging

- **URL**: `https://staging.ucicinemas.it`
- **Analytics**: Disabled
- **Modals**: Enabled
- **Timeouts**: Standard

### Development

- **URL**: `https://dev.ucicinemas.it`
- **Analytics**: Disabled
- **Modals**: Disabled
- **Timeouts**: Standard

## Troubleshooting

### Issue: Tests use wrong environment

**Solution**: Verify TEST_ENV is set correctly:

```bash
echo $TEST_ENV
```

### Issue: Override not working

**Solution**: Check environment variable name (must be `UCI_BASE_URL`, not `CINESA_BASE_URL`):

```bash
echo $UCI_BASE_URL
```

### Issue: Tests fail with timeout

**Solution**: Increase timeouts:

```bash
UCI_TIMEOUT_PAGE=60000 UCI_TIMEOUT_ELEMENT=20000 npm run test:uci:navbar
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: UCI Tests

on: [push, pull_request]

jobs:
  test-uci:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [production, staging, development]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run UCI tests
        env:
          TEST_ENV: ${{ matrix.environment }}
        run: npm run test:uci:navbar
```

### Jenkins Example

```groovy
pipeline {
    agent any
    
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['production', 'staging', 'development'],
            description: 'Select environment to test'
        )
    }
    
    stages {
        stage('Test UCI') {
            steps {
                script {
                    sh """
                        TEST_ENV=${params.ENVIRONMENT} npm run test:uci:navbar
                    """
                }
            }
        }
    }
}
```

## Comparison: Before vs After

### Before (Hardcoded)

```typescript
// Always used production URL
const navbar = new Navbar(page);
await navbar.navigateToHome(); // Always goes to https://ucicinemas.it
```

### After (Configurable)

```typescript
// Uses environment-specific URL
const navbar = new Navbar(page, config.baseUrl);
await navbar.navigateToHome(); // Goes to URL based on TEST_ENV

// TEST_ENV=staging → https://staging.ucicinemas.it
// TEST_ENV=development → https://dev.ucicinemas.it
// UCI_BASE_URL=https://custom.it → https://custom.it
```

## Next Steps

1. Update your local `.env` file if you have one
2. Update CI/CD pipeline configurations
3. Document any custom environments your team uses
4. Train team members on new configuration system
5. Consider adding environment-specific test data
