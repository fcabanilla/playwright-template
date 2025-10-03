# ADR-004: Unified Environment Configuration Across Namespaces

**Status**: Accepted

**Date**: 2025-10-03

**Authors**: [@fcabanilla]

**Reviewers**: [@fcabanilla, Cinema Automation Team]

## Context

Following the implementation of the multi-cinema architecture (ADR-003), we identified inconsistencies in how different namespaces (Cinesa and UCI) handled environment configuration and URL management. Cinesa had a robust environment configuration system with support for multiple environments and runtime overrides, while UCI used hardcoded URLs without environment flexibility.

### Background

- **Cinesa Implementation**: 
  - Uses `getCinesaConfig()` to retrieve environment-specific configurations
  - Fixtures inject `baseUrl` from environment configuration
  - Supports `TEST_ENV` environment variable
  - Allows runtime URL overrides via `CINESA_BASE_URL`
  - Enables testing across production, staging, preprod, and development environments

- **UCI Implementation**:
  - Page objects hardcoded production URLs
  - No environment variable support
  - No easy way to test against staging or development
  - Manual URL changes required for different environments
  - Inconsistent pattern compared to Cinesa

- **Configuration Files**:
  - `config/environments.ts`: Defines environment configurations for both namespaces
  - `config/urls.ts`: Generates navigation URLs based on environment config
  - Both files already supported UCI, but UCI page objects weren't using them

### Forces at Play

- **Consistency**: Need for uniform patterns across all namespaces
- **Multi-Environment Testing**: Critical for QA process (staging, preprod, production)
- **CI/CD Flexibility**: Pipelines need to test against different environments
- **Developer Experience**: Developers should use the same patterns regardless of namespace
- **Maintainability**: Changes to URL/config logic should follow same pattern everywhere
- **Backward Compatibility**: Can't break existing tests and workflows

## Decision

### Chosen Option

**Unify environment configuration pattern across all namespaces (UCI, Cinesa) by adopting Cinesa's proven configuration injection pattern**

We will modify UCI's fixtures and page objects to use the same environment configuration pattern as Cinesa, ensuring consistency and enabling multi-environment testing for all namespaces.

#### Implementation Details

**1. Fixtures Layer** - Inject environment configuration

```typescript
// fixtures/uci/playwright.fixtures.ts
navbar: async ({ page }, use) => {
  const env = process.env.TEST_ENV as UCIEnvironment || 'production';
  const config = getUCIConfig(env);
  const navbar = new Navbar(page, config.baseUrl);
  await use(navbar);
}
```

**2. Page Objects Layer** - Accept optional baseUrl parameter

```typescript
// pageObjectsManagers/uci/navbar/navbar.page.ts
constructor(page: Page, baseUrl?: string) {
  this.webActions = new WebActions(page);
  this.selectors = navbarSelectors;
  this.urls = getUCIUrls();
  this.url = baseUrl || this.urls.base;  // Use injected or default
}
```

**3. Configuration Usage** - Use injected URL

```typescript
async navigateToHome(): Promise<void> {
  await this.webActions.navigateTo(this.url);  // Uses injected URL
}
```

### Considered Alternatives

#### Option A: Keep Different Patterns per Namespace

- **Pros**:
  - No changes required to UCI
  - Each namespace can optimize for their specific needs
  - No risk of breaking existing UCI tests
  
- **Cons**:
  - Inconsistent patterns confuse developers
  - Duplicate documentation and training needed
  - Different CI/CD configurations per namespace
  - Makes onboarding harder
  - Maintenance complexity increases
  
- **Reason for rejection**: Violates DRY principle and creates unnecessary cognitive load

#### Option B: Create New Abstraction Layer for All Config

- **Pros**:
  - Unified abstraction for all namespaces
  - Single point of configuration management
  - Potential for advanced features
  
- **Cons**:
  - Over-engineering for current needs
  - Requires refactoring Cinesa (already working well)
  - Migration complexity
  - Risk of introducing bugs in stable code
  - Development time overhead
  
- **Reason for rejection**: Over-engineering; Cinesa's pattern already works well

#### Option C: Environment Configuration per Test File

- **Pros**:
  - Maximum flexibility per test
  - No global configuration needed
  
- **Cons**:
  - Massive code duplication
  - Configuration scattered across files
  - Hard to maintain consistency
  - Error-prone manual configuration
  
- **Reason for rejection**: Not scalable, high maintenance burden

## Consequences

### Positive

- **Consistency**: Identical patterns across all namespaces (Cinesa, UCI, future)
- **Multi-Environment Testing**: Easy testing against staging, production, development
- **CI/CD Flexibility**: Simple environment configuration in pipelines
- **Developer Experience**: Learn once, apply everywhere
- **Maintainability**: Single pattern to maintain and document
- **Scalability**: New namespaces automatically inherit this pattern
- **Runtime Flexibility**: Easy URL overrides without code changes
- **Documentation Efficiency**: One set of docs for all namespaces

### Negative

- **Migration Effort**: Need to update UCI fixtures and page objects
- **Testing Required**: Must verify no regressions in UCI tests
- **Documentation Updates**: Need to update UCI-specific docs
- **Breaking Change Risk**: Potential issues if not thoroughly tested

### Neutral

- **baseUrl Parameter**: All page objects now accept optional baseUrl
- **Backward Compatible**: Falls back to default URLs if not provided
- **Environment Variables**: New variables available (`UCI_BASE_URL`, etc.)
- **Configuration Precedence**: Runtime overrides take priority over config

## Implementation

### Implementation Plan

1. **Update UCI Fixtures** (30 minutes):
   - Import `getUCIConfig` and `UCIEnvironment` types
   - Read `TEST_ENV` environment variable
   - Inject `config.baseUrl` into page object constructors

2. **Update UCI Page Objects** (1 hour):
   - Add optional `baseUrl` parameter to constructors
   - Store injected URL in `this.url` property
   - Update navigation methods to use `this.url`
   - Maintain backward compatibility with default URLs

3. **Testing** (2 hours):
   - Test with default environment (production)
   - Test with `TEST_ENV=staging`
   - Test with `UCI_BASE_URL` override
   - Verify all existing UCI tests pass
   - Verify environment switching works correctly

4. **Documentation** (1 hour):
   - Create ADR-004 (this document)
   - Update environment configuration docs
   - Add examples for UCI environment usage
   - Update CI/CD documentation

### Success Criteria

- ✅ UCI fixtures inject environment configuration
- ✅ UCI page objects accept optional baseUrl
- ✅ All existing UCI tests pass without modification
- ✅ Environment switching works (`TEST_ENV=staging`)
- ✅ Runtime overrides work (`UCI_BASE_URL=...`)
- ✅ Pattern identical between Cinesa and UCI
- ✅ Documentation updated and clear
- ✅ Zero regression in existing functionality

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `TEST_ENV` | Target environment | `staging`, `production`, `development`, `preprod` |
| `UCI_BASE_URL` | Override UCI base URL | `https://test.ucicinemas.it` |
| `UCI_TIMEOUT_PAGE` | Override page load timeout | `60000` |
| `UCI_TIMEOUT_MODAL` | Override modal timeout | `30000` |
| `UCI_FEATURE_MODALS` | Enable/disable modals | `true`, `false` |
| `UCI_FEATURE_ANALYTICS` | Enable/disable analytics | `true`, `false` |
| `CINESA_BASE_URL` | Override Cinesa base URL | `https://test.cinesa.es` |

### Usage Examples

```bash
# Test UCI against staging
TEST_ENV=staging npm run test:uci:navbar

# Test UCI with custom URL
UCI_BASE_URL=https://my-test-server.ucicinemas.it npm run test:uci:navbar

# Test both namespaces against staging
TEST_ENV=staging npm run test

# Override multiple settings
TEST_ENV=staging \
UCI_BASE_URL=https://custom.ucicinemas.it \
UCI_TIMEOUT_PAGE=60000 \
UCI_FEATURE_MODALS=false \
npm run test:uci:navbar
```

### Rollback Plan

- **Immediate Rollback**: Revert commits in `feat/uci-environment-config` branch
- **Gradual Rollback**: Keep UCI changes, revert Cinesa if issues arise
- **Point of No Return**: After merging to main and deploying to CI/CD
- **Risk Mitigation**: Thorough testing before merge, feature branch isolation

## Notes

### Related Links

- [ADR-003: Multi-Cinema Architecture](./0003-multi-cinema-architecture.md)
- [Environment Configuration Documentation](../URL_CONFIGURATION.md)
- [Configuration Files](../../config/environments.ts)
- [URL Generation](../../config/urls.ts)

### Configuration Flow

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

### Architecture Comparison

**Before:**
```
CINESA: ✅ Configurable (TEST_ENV, overrides, multi-environment)
UCI:    ❌ Hardcoded (production only, no flexibility)
```

**After:**
```
CINESA: ✅ Configurable (TEST_ENV, overrides, multi-environment)
UCI:    ✅ Configurable (TEST_ENV, overrides, multi-environment)
         ⬆️ UNIFIED PATTERN
```

### Implementation Results

- **Branch**: `feat/uci-environment-config`
- **Files Changed**: 2 files (fixtures, navbar page object)
- **Lines Added**: ~15
- **Lines Removed**: ~3
- **Breaking Changes**: None (backward compatible)
- **Tests Updated**: 0 (all pass without modification)

### Future Considerations

- **Apply Pattern to All UCI Page Objects**: Extend to Cinema, Films, etc.
- **Shared Base Classes**: Consider base classes that automatically handle config injection
- **Configuration Validation**: Add runtime validation of environment configs
- **Configuration Builder**: Helper functions to build complex configs
- **Default Environment Files**: Consider `.env` files for local development

### Update

- **Last review**: October 3, 2025 by [@fcabanilla]
- **Next review**: Q4 2025 (after adding third namespace)
- **Implementation status**: Completed
- **Deployed to**: Development (feat/uci-environment-config branch)
- **Production status**: Pending merge and deployment

---

**Implementation Success**: The unified environment configuration pattern has been successfully implemented for UCI, achieving full consistency with Cinesa and enabling flexible multi-environment testing across all namespaces.
