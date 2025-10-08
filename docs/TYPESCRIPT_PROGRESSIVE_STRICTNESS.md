# TypeScript Progressive Strictness Plan

**Status**: In Progress  
**Started**: October 3, 2025  
**Related**: ADR-002 (TypeScript Strict Mode)

---

## Overview

This document outlines the plan to progressively enable TypeScript strict mode in the project. Rather than enabling all strict checks at once (which would create ~45 type errors), we're adopting a phased approach to gradually improve type safety without disrupting development.

## Current Status

- **Total Strict Mode Errors**: ~45 errors
- **Current Errors with Relaxed Config**: 10 errors
- **Target**: 0 errors with full strict mode

## Progressive Strictness Phases

### ✅ Phase 0: Foundation (Completed)

**Status**: ✅ Completed  
**Date**: October 3, 2025

- [x] Create `tsconfig.json` with ES2022 modules
- [x] Add `DOM` to lib for browser types (`window`, `document`)
- [x] Enable basic type checking
- [x] Add `typecheck` scripts to `package.json`
- [x] Document progressive approach

**Enabled Checks**:

```json
{
  "strictFunctionTypes": true,
  "strictBindCallApply": true,
  "noImplicitThis": true,
  "alwaysStrict": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "noImplicitOverride": true
}
```

**Current Errors**: 10

---

### 🔄 Phase 1: Fix Remaining Basic Errors (Next)

**Target Date**: Week of October 7, 2025  
**Estimated Effort**: 2-4 hours

**Goal**: Fix the remaining 10 type errors with current configuration.

**Known Issues**:

1. `webActions-fixed.ts`: Missing CloudflareHandler methods
2. Analytics page: Browser API types issues
3. Cinema pages: `string | undefined` assignments
4. Unused imports

**Tasks**:

- [ ] Fix CloudflareHandler method signatures
- [ ] Fix analytics page browser API usage
- [ ] Add null checks for `textContent()` returns
- [ ] Remove or fix unused variables
- [ ] Verify all tests still pass

**Success Criteria**: `npm run typecheck` returns 0 errors

---

### 📋 Phase 2: Enable `noImplicitAny`

**Target Date**: Week of October 14, 2025  
**Estimated Effort**: 4-6 hours

**Goal**: Require explicit types, eliminate implicit `any` types.

**Changes**:

```json
{
  "noImplicitAny": true
}
```

**Expected Impact**: ~15-20 new errors

**Common Patterns to Fix**:

```typescript
// Before (implicit any)
function handleEvent(event) { ... }

// After (explicit type)
function handleEvent(event: Event) { ... }
```

**Tasks**:

- [ ] Add explicit types to function parameters
- [ ] Add types to callback parameters
- [ ] Type array iterations properly
- [ ] Document complex types

---

### 📋 Phase 3: Enable `strictNullChecks` and `strictPropertyInitialization`

**Target Date**: Week of October 21, 2025  
**Estimated Effort**: 6-8 hours

**Goal**: Catch null/undefined errors at compile time.

**Changes**:

```json
{
  "strictNullChecks": true,
  "strictPropertyInitialization": true
}
```

**Expected Impact**: ~20-25 new errors

**Common Patterns to Fix**:

```typescript
// Before
let name: string;
name = possiblyUndefined();

// After (Option 1: Assert non-null)
let name: string;
name = possiblyUndefined() || 'default';

// After (Option 2: Allow undefined)
let name: string | undefined;
name = possiblyUndefined();

// Before (class property)
class User {
  name: string;
}

// After (initialize or mark optional)
class User {
  name: string = '';
  // or
  name?: string;
}
```

**Tasks**:

- [ ] Add null checks before accessing properties
- [ ] Initialize class properties
- [ ] Use optional chaining (`?.`)
- [ ] Use nullish coalescing (`??`)
- [ ] Mark truly optional properties

---

### 📋 Phase 4: Enable Code Quality Checks

**Target Date**: Week of October 28, 2025  
**Estimated Effort**: 3-4 hours

**Goal**: Remove dead code and improve code quality.

**Changes**:

```json
{
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noUncheckedIndexedAccess": true
}
```

**Expected Impact**: ~10-15 new errors

**Common Patterns to Fix**:

```typescript
// Before (unused variable)
const unused = getData();

// After (remove or prefix with _)
const _unused = getData(); // Keep if needed for future

// Before (unchecked array access)
const first = array[0];

// After
const first = array[0];
if (first) {
  // use first
}
```

**Tasks**:

- [ ] Remove unused imports
- [ ] Remove unused variables
- [ ] Prefix intentionally unused params with `_`
- [ ] Add array bounds checks

---

### 📋 Phase 5: Enable Full Strict Mode

**Target Date**: Week of November 4, 2025  
**Estimated Effort**: 1-2 hours

**Goal**: Enable the full `strict` flag.

**Changes**:

```json
{
  "strict": true
}
```

**Expected Impact**: 0 new errors (all previous phases completed)

**Tasks**:

- [ ] Enable `strict: true`
- [ ] Remove individual strict flags (now covered by `strict`)
- [ ] Final verification
- [ ] Update documentation
- [ ] Celebrate! 🎉

---

## Running Type Checks

### During Development

```bash
# One-time check
npm run typecheck

# Watch mode (checks on file save)
npm run typecheck:watch
```

### In CI/CD

Add to GitHub Actions / Jenkins:

```yaml
- name: TypeScript Type Check
  run: npm run typecheck
```

## Tracking Progress

### Current Phase Checklist

Update this as you complete phases:

- [x] Phase 0: Foundation ✅
- [ ] Phase 1: Fix Basic Errors
- [ ] Phase 2: noImplicitAny
- [ ] Phase 3: Strict Null Checks
- [ ] Phase 4: Code Quality
- [ ] Phase 5: Full Strict Mode

### Error Count by Phase

Track progress:

| Phase   | Date       | Errors        | Notes                                |
| ------- | ---------- | ------------- | ------------------------------------ |
| Phase 0 | 2025-10-03 | 10            | Initial baseline with relaxed config |
| Phase 1 | TBD        | Target: 0     | Fix current errors                   |
| Phase 2 | TBD        | Expected: ~15 | Enable noImplicitAny                 |
| Phase 3 | TBD        | Expected: ~20 | Enable strictNullChecks              |
| Phase 4 | TBD        | Expected: ~10 | Enable unused checks                 |
| Phase 5 | TBD        | **Target: 0** | Full strict mode                     |

## Best Practices

### When Adding New Code

1. **Write strictly typed code** even if strict mode isn't fully enabled
2. **Run typecheck** before committing
3. **Don't add new type errors** - fix them as you go
4. **Use proper types** instead of `any`

### Example: Good vs Bad

```typescript
// ❌ BAD (will fail in future phases)
function processData(data) {
  return data.map((item) => item.value);
}

// ✅ GOOD (ready for strict mode)
function processData(data: DataItem[]): number[] {
  return data.map((item) => item.value);
}

// ❌ BAD (null/undefined issues)
let config: Config;
config.apiUrl = getUrl();

// ✅ GOOD (explicit handling)
let config: Config | undefined;
config = loadConfig();
if (config) {
  const url = config.apiUrl;
}
```

## Common Issues and Solutions

### Issue: `Object is possibly 'undefined'`

```typescript
// Problem
const text = element.textContent();
// text is string | null

// Solution 1: Null coalescing
const text = element.textContent() || '';

// Solution 2: Explicit check
const textContent = element.textContent();
if (textContent) {
  const text = textContent;
}

// Solution 3: Non-null assertion (use sparingly!)
const text = element.textContent()!;
```

### Issue: `Parameter implicitly has 'any' type`

```typescript
// Problem
array.forEach(item => console.log(item));

// Solution: Add explicit type
array.forEach((item: MyType) => console.log(item));

// Or type the array
const items: MyType[] = [...];
items.forEach(item => console.log(item)); // item is inferred
```

### Issue: `Cannot find name 'window'`

```typescript
// Problem: Missing DOM types
const width = window.innerWidth;

// Solution: Already fixed in Phase 0
// Added "DOM" to lib in tsconfig.json
```

## Benefits of Progressive Approach

1. **No Breaking Changes**: Development continues without interruption
2. **Learning Curve**: Team learns gradually
3. **Manageable Chunks**: Fix errors in small batches
4. **Continuous Improvement**: Each phase adds value
5. **Flexible Timeline**: Can adjust based on team capacity

## Resources

- [TypeScript Strict Mode Documentation](https://www.typescriptlang.org/tsconfig#strict)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [ADR-002: TypeScript Strict Mode](./adrs/0002-typescript-strict-mode.md)

---

**Maintained by**: Cinema Automation Team (@fcabanilla)  
**Last Updated**: October 3, 2025  
**Next Review**: After Phase 1 completion
