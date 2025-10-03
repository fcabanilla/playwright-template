# Session State Management

## Overview

This document explains how session state files work in the project, particularly for handling Cloudflare protection and authentication across different environments.

## What are Session State Files?

Session state files (`.json`) contain:
- **Cookies**: Authentication tokens, session IDs, Cloudflare bypass tokens
- **Local Storage**: Application state, user preferences
- **Session Storage**: Temporary data

These files allow tests to bypass login and Cloudflare challenges by reusing previously captured browser state.

## File Structure

```
playwright-template/
├── loggedInState.json              # Production session (gitignored)
├── loggedInState.preprod.json      # Preprod session (gitignored)
├── loggedInState.staging.json      # Staging session (gitignored)
├── loggedInState.dev.json          # Development session (gitignored)
└── notLoggedInState.json           # Empty state for clean sessions (gitignored)
```

**⚠️ IMPORTANT**: All session state files are gitignored and should NEVER be committed to the repository as they contain sensitive authentication data.

## Environment-Specific State Files

The project automatically selects the correct state file based on the `TEST_ENV` environment variable:

| Environment | `TEST_ENV` Value | State File |
|-------------|------------------|------------|
| Production | `production` (default) | `loggedInState.json` |
| Preprod | `preprod` | `loggedInState.preprod.json` |
| Staging | `staging` | `loggedInState.staging.json` |
| Development | `development` | `loggedInState.dev.json` |

## Generating Session State Files

### For Cinesa

1. **Set the target environment**:
   ```bash
   export TEST_ENV=preprod  # or staging, development, production
   ```

2. **Run the authentication script**:
   ```bash
   npm run test:cinesa:cloudflare -- tests/cinesa/cloudflare/auth.saveState.spec.ts
   ```

3. **Manual steps**:
   - Browser will open to the configured environment URL
   - Log in manually if needed
   - Pass Cloudflare challenge (if present)
   - Wait for the navbar to appear
   - Script will automatically save state and close browser

4. **Verify file was created**:
   ```bash
   ls -la loggedInState*.json
   ```

### For UCI

UCI uses a similar pattern but may require additional Cloudflare handling:

```bash
export TEST_ENV=production
npm run test:uci:cloudflare -- tests/uci/cloudflare/auth.saveState.spec.ts
```

## Using Session State in Tests

### Playwright Config

The `playwright.config.ts` automatically loads the correct state file:

```typescript
// For UCI project
{
  name: 'UCI Cinemas',
  use: {
    storageState: process.env.TEST_ENV === 'preprod'
      ? 'loggedInState.preprod.json'
      : 'loggedInState.json',
  }
}

// For Cinesa project
{
  name: 'Cinesa',
  use: {
    storageState: process.env.TEST_ENV === 'preprod'
      ? 'loggedInState.preprod.json'
      : undefined,  // Cinesa production doesn't need state
  }
}
```

### In Test Files

Tests automatically inherit the state from the project configuration:

```typescript
// No additional configuration needed
test('Navigate to home', async ({ page }) => {
  // Page already has authentication state loaded
  await page.goto('https://preprod-web.ocgtest.es/');
  // User is already logged in, Cloudflare already bypassed
});
```

### For Specific Tests Without State

```typescript
test.use({ storageState: undefined });

test('Test without authentication', async ({ page }) => {
  // Clean slate, no cookies or localStorage
  await page.goto('https://www.cinesa.es/');
});
```

## Session State Contents

### Example Structure

```json
{
  "cookies": [
    {
      "name": "__cf_bm",
      "value": "...",
      "domain": ".cinesa.es",
      "path": "/",
      "expires": 1759504302,
      "httpOnly": true,
      "secure": true,
      "sameSite": "None"
    }
  ],
  "origins": [
    {
      "origin": "https://www.cinesa.es",
      "localStorage": [
        {
          "name": "VistaOmnichannelComponents::version-number",
          "value": "15.0.0"
        }
      ]
    }
  ]
}
```

### Important Cookies

| Cookie Name | Purpose | Environment-Specific |
|-------------|---------|---------------------|
| `__cf_bm` | Cloudflare Bot Management | ✅ Yes |
| `_cfuvid` | Cloudflare User ID | ✅ Yes |
| `Queue-it-token` | Queue-it token | ✅ Yes |
| `QueueITAccepted-*` | Queue-it acceptance | ✅ Yes |

**⚠️ Note**: Cookies contain domain-specific information and **cannot be reused across different environments**.

## Troubleshooting

### Problem: Tests fail with "Not authenticated" error

**Solution**: Regenerate the session state file for that environment.

```bash
export TEST_ENV=preprod
npm run test:cinesa:cloudflare -- tests/cinesa/cloudflare/auth.saveState.spec.ts
```

### Problem: Cloudflare challenge appears even with state file

**Possible causes**:
1. **Cookies expired**: Regenerate the state file
2. **IP address changed**: Cloudflare may require new challenge
3. **Wrong environment**: Verify `TEST_ENV` matches the state file

**Solution**: Delete the state file and regenerate it.

### Problem: localStorage has wrong URLs

This is expected. The `localStorage` contains URLs from when the state was captured. Playwright will use the URLs from your test navigation, not from localStorage.

**Example**:
```json
// localStorage captured from production
"origin": "https://www.cinesa.es"

// But your test navigates to:
await page.goto('https://preprod-web.ocgtest.es/');
// This is fine, Playwright handles it correctly
```

### Problem: State file not found

**Error**: `ENOENT: no such file or directory, open 'loggedInState.preprod.json'`

**Solution**: Generate the state file for that environment first:

```bash
TEST_ENV=preprod npm run test:cinesa:cloudflare -- tests/cinesa/cloudflare/auth.saveState.spec.ts
```

## Best Practices

### ✅ DO

- **Regenerate state files regularly** (weekly or when tests start failing)
- **Use environment-specific state files** for each environment
- **Keep state files local** (never commit to git)
- **Document which environments need authentication state**
- **Verify state file exists before running tests** in CI/CD

### ❌ DON'T

- **Never commit state files to git** (they contain sensitive data)
- **Don't share state files** between team members
- **Don't reuse production state for preprod** (domains don't match)
- **Don't manually edit state files** (regenerate instead)
- **Don't assume state is valid forever** (cookies expire)

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Generate session state
  run: |
    TEST_ENV=${{ matrix.environment }} npm run test:cinesa:cloudflare -- tests/cinesa/cloudflare/auth.saveState.spec.ts
  env:
    TEST_ENV: ${{ matrix.environment }}

- name: Run tests with session state
  run: |
    TEST_ENV=${{ matrix.environment }} npm run test:cinesa
  env:
    TEST_ENV: ${{ matrix.environment }}
```

### Jenkins Example

```groovy
stage('Generate Session State') {
    steps {
        sh """
            export TEST_ENV=${params.ENVIRONMENT}
            npm run test:cinesa:cloudflare -- tests/cinesa/cloudflare/auth.saveState.spec.ts
        """
    }
}

stage('Run Tests') {
    steps {
        sh """
            export TEST_ENV=${params.ENVIRONMENT}
            npm run test:cinesa
        """
    }
}
```

## Security Considerations

### Sensitive Data in State Files

State files contain:
- Authentication tokens
- Session IDs
- User-specific data
- Cloudflare bypass tokens

**Security measures**:
1. ✅ All state files are in `.gitignore`
2. ✅ State files are not shared between environments
3. ✅ State files expire and need regeneration
4. ⚠️ In CI/CD, state files should be in secure storage (not in artifacts)

### Rotation Policy

- **Local development**: Regenerate weekly or when tests fail
- **CI/CD**: Regenerate before each test run or daily
- **After security updates**: Regenerate immediately
- **After Cloudflare changes**: Regenerate immediately

## Related Files

- [`tests/cinesa/cloudflare/auth.saveState.spec.ts`](../tests/cinesa/cloudflare/auth.saveState.spec.ts) - Script to generate state
- [`playwright.config.ts`](../playwright.config.ts) - Project configuration with storageState
- [`.gitignore`](../.gitignore) - Ensures state files are not committed
- [`core/webactions/setupCloudflareContextAndPage.ts`](../core/webactions/setupCloudflareContextAndPage.ts) - Helper for state loading

## Related Documentation

- [Cloudflare Handling](./CLOUDFLARE_HANDLING.md)
- [Environment Configuration](./URL_CONFIGURATION.md)
- [Playwright Authentication Docs](https://playwright.dev/docs/auth)

---

**Last Updated**: October 3, 2025  
**Maintained by**: Cinema Automation Team (@fcabanilla)
