# ADR-0012: Cross-Env for Cross-Platform Environment Variable Management

**Status**: Proposed

**Date**: 2025-10-21

**Authors**: [@fcabanilla]

**Reviewers**: [Pending]

## Context

The Playwright test automation framework is developed and executed across multiple operating systems: macOS, Windows, and potentially Linux CI/CD environments. Currently, npm scripts use POSIX-style environment variable assignment (`TEST_ENV=preprod npm test`), which is incompatible with Windows command-line environments (cmd.exe and PowerShell).

### Background

- **Current State**:

  - Package.json contains 70+ npm scripts
  - Environment variables set using `TEST_ENV=value` syntax
  - Works on macOS/Linux but fails on Windows
  - Team composition: 1 macOS developer, 2 Windows developers

- **Problem Statement**:

  - Windows developers cannot run npm scripts directly
  - Workarounds (Git Bash, WSL) add friction to development workflow
  - Inconsistent developer experience across team
  - CI/CD pipelines may fail when switching between runner OS types

- **Example of Current Broken Syntax**:

  ```json
  "test:cinesa:preprod": "TEST_ENV=preprod npx playwright test --project='Cinesa'"
  ```

  This works on macOS/Linux but fails on Windows with:

  ```text
  'TEST_ENV' is not recognized as an internal or external command
  ```

### Forces at Play

- **Technical Constraints**:

  - Windows cmd.exe uses `SET VAR=value` syntax
  - Windows PowerShell uses `$env:VAR="value"` syntax
  - macOS/Linux use `VAR=value` inline syntax
  - No built-in Node.js solution for cross-platform env vars

- **Team Requirements**:

  - Developers must be able to run tests from any OS without modifications
  - Onboarding should not require OS-specific documentation
  - CI/CD must work across GitHub Actions (Linux), Azure DevOps (Windows/Linux)

- **Business Constraints**:
  - Cannot mandate single OS for all developers
  - Development velocity should not be impacted by OS differences
  - Test execution must be consistent across environments

## Decision

### Chosen Option

**Use `cross-env` npm package for all environment variable assignments in npm scripts**

We will adopt `cross-env` as a dev dependency and refactor all npm scripts to use it for setting environment variables. This provides a zero-configuration, cross-platform solution that works identically on Windows, macOS, and Linux.

**Implementation Pattern**:

```json
// Before (macOS/Linux only)
"test:cinesa:preprod": "TEST_ENV=preprod npx playwright test --project='Cinesa'"

// After (cross-platform)
"test:cinesa:preprod": "cross-env TEST_ENV=preprod npx playwright test --project='Cinesa'"
```

### Considered Alternatives

#### Option A: OS-Specific Scripts

Create separate scripts for Windows and Unix systems:

```json
"test:cinesa:preprod": "npm run test:cinesa:preprod:unix",
"test:cinesa:preprod:unix": "TEST_ENV=preprod npx playwright test",
"test:cinesa:preprod:win": "SET TEST_ENV=preprod && npx playwright test"
```

- **Pros**:
  - No additional dependencies
  - Native OS syntax
- **Cons**:
  - Doubles script count (70 scripts → 140 scripts)
  - Developers must know which script to run on their OS
  - Maintenance nightmare (every script update requires 2 changes)
  - Doesn't solve PowerShell vs cmd.exe differences on Windows
- **Reason for rejection**: Violates DRY principle, poor maintainability, bad developer experience

#### Option B: Mandate Git Bash/WSL for Windows

Require Windows developers to use Git Bash or Windows Subsystem for Linux (WSL):

- **Pros**:
  - No code changes required
  - Unix-like environment on Windows
- **Cons**:
  - Forces developers to use specific tools
  - Adds complexity to onboarding
  - WSL has performance overhead for file I/O
  - Git Bash may have PATH/compatibility issues
  - Doesn't work for PowerShell users
  - CI/CD runners may not have Git Bash
- **Reason for rejection**: Creates artificial barriers, degrades Windows developer experience

#### Option C: Use .env Files Only

Move all environment configuration to `.env` files and load with dotenv:

- **Pros**:
  - No OS-specific syntax in scripts
  - Centralized configuration
- **Cons**:
  - Requires creating multiple `.env.preprod`, `.env.lab`, `.env.staging` files
  - Scripts must specify which .env file to load
  - Loses flexibility of inline env vars for quick testing
  - Doesn't solve the problem (still need OS-specific syntax to switch .env files)
  - Complicates CI/CD configuration
- **Reason for rejection**: Incomplete solution, adds configuration overhead

#### Option D: Native Node.js Script Wrapper

Create a Node.js script that sets env vars before spawning Playwright:

```javascript
// run-test.js
process.env.TEST_ENV = process.argv[2];
spawn('npx', ['playwright', 'test']);
```

- **Pros**:
  - No dependencies
  - Full control over execution
- **Cons**:
  - Requires maintaining custom script
  - More complex than cross-env
  - Doesn't integrate with npm scripts naturally
  - Reinventing the wheel
- **Reason for rejection**: Over-engineered, cross-env already solves this problem

## Consequences

### Positive

- **Cross-Platform Compatibility**: Scripts work identically on Windows, macOS, Linux
- **Zero Configuration**: Developers don't need to configure anything OS-specific
- **Improved Onboarding**: New developers can run tests immediately regardless of OS
- **CI/CD Flexibility**: Can use any OS for runners without script modifications
- **Industry Standard**: `cross-env` has 100M+ downloads/month, widely adopted
- **Minimal Change**: Only adds 10 characters (cross-env prefix) to affected scripts
- **Future-Proof**: Works with any future environment variables we add
- **Developer Velocity**: Windows developers no longer blocked by script incompatibility

### Negative

- **New Dependency**: Adds `cross-env` to devDependencies (~7KB package)
- **Slight Performance Overhead**: Spawns additional process (negligible ~10ms)
- **Package.json Verbosity**: Scripts become slightly longer with `cross-env` prefix
- **Migration Effort**: Must update all 70+ scripts in package.json

### Neutral

- **Learning Curve**: Team must understand to use `cross-env` for new scripts (minimal, 5 min)
- **Dependency Management**: One more package to keep updated (automated with Dependabot)
- **Documentation Updates**: README and contribution guides need minor updates

## Implementation

### Implementation Plan

1. **Install cross-env**:

   ```bash
   npm install --save-dev cross-env
   ```

2. **Audit package.json scripts**:

   - Identify all scripts using environment variable assignment
   - Categorize by type: test, codegen, auth, report, etc.

3. **Refactor scripts systematically**:

   - Add `cross-env` prefix to all scripts with `TEST_ENV=...`
   - Group scripts by platform (Cinesa, UCI) and environment (preprod, lab, staging)
   - Standardize naming conventions while refactoring

4. **Add new organized scripts**:

   - Smoke tests: `test:cinesa:smoke:preprod`, `test:uci:smoke:lab`
   - Regression: `test:cinesa:regression:preprod`
   - Critical: `test:cinesa:critical:staging`
   - Fast: `test:cinesa:fast`

5. **Validate on all platforms**:

   - Test on macOS (primary developer)
   - Test on Windows (2 team members)
   - Test in CI/CD (Azure DevOps, GitHub Actions)

6. **Update documentation**:
   - Add cross-env to README prerequisites
   - Update CONTRIBUTING.md with script conventions
   - Document in STYLEGUIDE.md

### Success Criteria

- ✅ All npm scripts execute successfully on macOS, Windows, Linux
- ✅ Windows developers can run `npm run test:cinesa:preprod` without errors
- ✅ CI/CD pipelines pass on both Linux and Windows runners
- ✅ No OS-specific workarounds needed in documentation
- ✅ TypeScript typecheck passes after changes
- ✅ Zero regression in test execution behavior

### Rollback Plan

- **Pre-Implementation**: Create git branch for refactoring
- **During Implementation**: Keep old scripts commented in package.json temporarily
- **Rollback Steps**:
  1. Revert package.json to previous version
  2. Remove cross-env from devDependencies
  3. Document why rollback was necessary (edge case failures)
- **Point of No Return**: After 2 weeks of successful cross-platform validation
- **Risk Mitigation**: cross-env is battle-tested with 100M+ downloads, rollback unlikely

## Notes

### Related Links

- [cross-env npm package](https://www.npmjs.com/package/cross-env)
- [cross-env GitHub repository](https://github.com/kentcdodds/cross-env)
- [Related to ADR-0004: Unified Environment Configuration](./0004-unified-environment-configuration.md)
- [Related to ADR-0003: Multi-Cinema Architecture](./0003-multi-cinema-architecture.md)

### Additional Context

- **Popularity**: cross-env has 100M+ downloads/month on npm
- **Maintenance**: Actively maintained, last published 2024
- **Size**: ~7KB (minimal impact on node_modules)
- **License**: MIT (permissive, no legal concerns)
- **Creator**: Kent C. Dodds (renowned in JavaScript community)

### Best Practices

1. **Always use cross-env for TEST_ENV assignments**:

   ```json
   "script": "cross-env TEST_ENV=preprod npx playwright test"
   ```

2. **Multiple environment variables**:

   ```json
   "script": "cross-env TEST_ENV=preprod DEBUG=true npx playwright test"
   ```

3. **Don't use for .env file loading** (dotenv handles this):

   ```json
   // ❌ Don't do this
   "script": "cross-env NODE_ENV=test node -r dotenv/config test.js"

   // ✅ Do this instead
   "script": "cross-env NODE_ENV=test node test.js"
   ```

4. **Combine with other npm features**:

   ```json
   "script": "cross-env TEST_ENV=preprod npm run test:specific"
   ```

### Update

- **Last review**: 2025-10-21 by [@fcabanilla]
- **Next review**: 2025-11-21 (after 1 month of usage)
- **Implementation status**: Proposed

---

**Template Version**: 1.0  
**Created**: October 21, 2025  
**Maintained by**: Cinema Automation Team
