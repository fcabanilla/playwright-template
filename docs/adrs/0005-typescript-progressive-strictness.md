# ADR-005: TypeScript Progressive Strictness Strategy

**Status**: Accepted

**Date**: 2025-10-03

**Authors**: [@fcabanilla]

**Reviewers**: [@fcabanilla, Cinema Automation Team]

## Context

The Playwright test automation project was created without a `tsconfig.json` file, which meant TypeScript's type checking was not being utilized during development. While tests executed successfully at runtime, the lack of compile-time type checking exposed the codebase to potential type-related bugs and made it harder to catch errors early in the development cycle.

### Background

- **No TypeScript Configuration**: Project had no `tsconfig.json`, relying solely on runtime checks
- **ES2022 Modules**: Project uses `"type": "module"` in `package.json` with import/export syntax
- **Playwright Requirement**: Playwright works with TypeScript but doesn't require strict type checking
- **Growing Codebase**: ~100+ test files across Cinesa and UCI namespaces
- **Mixed Type Safety**: Some files well-typed, others with implicit `any` types
- **No Validation Pipeline**: No type checking in development or CI/CD

### Problem Statement

When attempting to introduce TypeScript strict mode directly (`"strict": true`), the project generated **~45 type errors** across multiple files. These errors ranged from:

- Missing browser type definitions (`window`, `document`)
- Implicit `any` types in function parameters
- Potential `null` or `undefined` access
- Unused variables and parameters
- Unchecked array access

**Forcing immediate strict mode compliance would:**

- Block all development until ~45 errors are fixed
- Require massive refactoring effort (estimated 20-30 hours)
- Risk introducing bugs during mass changes
- Create merge conflicts with ongoing work
- Demoralize team with overwhelming task

### Forces at Play

- **Type Safety**: Need for compile-time error detection
- **Development Velocity**: Can't block all work for weeks
- **Team Learning Curve**: Gradual adoption helps learning
- **Code Quality**: Want to improve, not just fix errors
- **Backward Compatibility**: Existing tests must continue working
- **CI/CD Integration**: Need automated validation
- **ES2022 Modules**: Must align with existing module system

## Decision

### Chosen Option

**Implement TypeScript Progressive Strictness Strategy with 5 Phased Rollout**

We will gradually enable TypeScript strict mode through a structured 5-phase approach, enabling specific compiler checks incrementally. This allows the team to fix errors in manageable batches while continuously improving type safety.

#### Implementation Strategy

**Phase 0: Foundation** (Completed - Oct 3, 2025)

- Create `tsconfig.json` with ES2022 modules
- Add `DOM` library for browser types
- Enable essential type safety checks
- Add development scripts
- Establish baseline: **10 errors**

**Phase 1: Fix Basic Errors** (Target: Week of Oct 7)

- Fix remaining 10 errors with current config
- Establish zero-error baseline
- Estimated effort: 2-4 hours

**Phase 2: Enable `noImplicitAny`** (Target: Week of Oct 14)

- Require explicit types for parameters
- Eliminate implicit `any` types
- Expected: ~15-20 new errors
- Estimated effort: 4-6 hours

**Phase 3: Enable Strict Null Checks** (Target: Week of Oct 21)

- Enable `strictNullChecks` and `strictPropertyInitialization`
- Catch null/undefined errors at compile time
- Expected: ~20-25 new errors
- Estimated effort: 6-8 hours

**Phase 4: Enable Code Quality Checks** (Target: Week of Oct 28)

- Enable `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`
- Remove dead code, add bounds checks
- Expected: ~10-15 new errors
- Estimated effort: 3-4 hours

**Phase 5: Enable Full Strict Mode** (Target: Week of Nov 4)

- Enable `"strict": true` flag
- Remove individual flags (covered by `strict`)
- Expected: 0 new errors (all previous phases complete)
- Estimated effort: 1-2 hours

### Initial TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022", "DOM"],
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,

    // Progressive Strictness - Phase 0
    "strict": false, // ⚠️ Temporarily disabled

    // Essential type safety (already enabled)
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    // Phase 2: Enable after Phase 1 complete
    "noImplicitAny": false, // TODO: Enable in Phase 2

    // Phase 3: Enable after Phase 2 complete
    "strictNullChecks": false, // TODO: Enable in Phase 3
    "strictPropertyInitialization": false, // TODO: Enable in Phase 3

    // Phase 4: Enable after Phase 3 complete
    "noUnusedLocals": false, // TODO: Enable in Phase 4
    "noUnusedParameters": false, // TODO: Enable in Phase 4
    "noUncheckedIndexedAccess": false, // TODO: Enable in Phase 4

    // Additional checks
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true
  },
  "include": ["**/*.ts"],
  "exclude": [
    "node_modules",
    "playwright-report",
    "test-results",
    "allure-report"
  ]
}
```

### Development Scripts

Added to `package.json`:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch"
  }
}
```

### Considered Alternatives

#### Option A: Enable Full Strict Mode Immediately

- **Pros**:
  - Maximum type safety immediately
  - No phased planning needed
  - Clear target state
- **Cons**:
  - Blocks all development until ~45 errors fixed
  - Massive refactoring effort (20-30 hours)
  - High risk of introducing bugs
  - Team overwhelm and frustration
  - Merge conflicts with ongoing work
- **Reason for rejection**: Not practical for active project with ongoing development

#### Option B: Never Enable Strict Mode

- **Pros**:
  - No changes needed
  - No development interruption
  - No learning curve
- **Cons**:
  - Misses entire value of TypeScript
  - Allows type errors to persist
  - Runtime bugs that could be caught at compile time
  - Lower code quality
  - No CI/CD validation
- **Reason for rejection**: Defeats purpose of using TypeScript

#### Option C: Per-File Opt-In Strict Mode

- **Pros**:
  - Each file can enable strict mode independently
  - Gradual migration per file
- **Cons**:
  - Inconsistent configuration across files
  - Hard to track progress
  - Complex to maintain
  - `// @ts-strict` comments in every file
  - No clear migration path to full strictness
- **Reason for rejection**: Creates fragmented codebase, hard to maintain

#### Option D: Create Separate TypeScript Project for New Code

- **Pros**:
  - New code starts strict from day one
  - No need to fix existing code
- **Cons**:
  - Two different TypeScript configurations
  - Complex build process
  - Code sharing difficulties
  - Confusing for team
  - Maintenance nightmare
- **Reason for rejection**: Over-engineering, creates artificial separation

## Consequences

### Positive

- **Manageable Effort**: Errors fixed in small batches (~4-8 hours per phase)
- **Continuous Improvement**: Each phase adds value without blocking work
- **Learning Opportunity**: Team learns TypeScript best practices gradually
- **No Development Block**: Work continues between phases
- **Clear Progress Tracking**: Defined phases with measurable goals
- **Flexible Timeline**: Can adjust based on team capacity
- **Early Value**: Phase 0 already caught 10 errors with minimal config
- **CI/CD Ready**: Can add type checking to pipelines immediately
- **Documentation**: Clear path for new team members

### Negative

- **Extended Timeline**: Full strict mode won't be achieved for ~5 weeks
- **Discipline Required**: Team must maintain phase discipline
- **New Errors Between Phases**: New code might add errors during transition
- **Coordination Needed**: Multiple developers need to stay aligned
- **Documentation Maintenance**: Need to update as phases complete

### Neutral

- **Phase Independence**: Each phase can be adjusted independently
- **Opt-Out Option**: Can pause or skip phases if needed (not recommended)
- **Error Count Estimates**: Actual errors may vary from estimates
- **Timeline Flexibility**: Dates are targets, not hard deadlines

## Implementation

### Phase 0: Foundation (✅ Completed)

**Completed**: October 3, 2025  
**Effort**: 2 hours  
**Result**: Baseline established with 10 errors

**Actions Taken**:

- ✅ Created `tsconfig.json` with ES2022 configuration
- ✅ Added `DOM` library for browser types (`window`, `document`, etc.)
- ✅ Enabled essential type safety checks
- ✅ Added `typecheck` and `typecheck:watch` scripts
- ✅ Documented progressive strictness strategy
- ✅ Reduced errors from ~45 to 10

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

### Phase 1: Fix Basic Errors (🔄 Next)

**Target Date**: Week of October 7, 2025  
**Estimated Effort**: 2-4 hours  
**Goal**: Achieve zero errors with current configuration

**Known Issues to Fix**:

1. `core/webactions/webActions-fixed.ts`: Missing CloudflareHandler methods
2. `pageObjectsManagers/cinesa/analytics/analytics.page.ts`: Browser API types
3. Various cinema page objects: `string | undefined` assignments
4. Unused imports and variables

**Tasks**:

- [ ] Fix CloudflareHandler method signatures in webActions-fixed.ts
- [ ] Fix analytics page browser API usage (window, document)
- [ ] Add null checks for `textContent()` returns
- [ ] Remove or annotate unused variables
- [ ] Verify all tests still pass after fixes
- [ ] Run full test suite to ensure no regressions

**Success Criteria**:

- `npm run typecheck` returns **0 errors**
- All existing tests pass without modification
- No new type errors introduced

### Phase 2: Enable `noImplicitAny` (📋 Planned)

**Target Date**: Week of October 14, 2025  
**Estimated Effort**: 4-6 hours  
**Expected New Errors**: ~15-20

**Change to Apply**:

```json
{
  "noImplicitAny": true // Require explicit types
}
```

**Common Patterns to Fix**:

```typescript
// ❌ Before (implicit any)
function handleEvent(event) { ... }

// ✅ After (explicit type)
function handleEvent(event: MouseEvent) { ... }
```

**Tasks**:

- [ ] Add explicit types to function parameters
- [ ] Add types to callback parameters
- [ ] Type array iterations properly
- [ ] Document complex types with interfaces
- [ ] Update tests with proper types

### Phase 3: Enable Strict Null Checks (📋 Planned)

**Target Date**: Week of October 21, 2025  
**Estimated Effort**: 6-8 hours  
**Expected New Errors**: ~20-25

**Changes to Apply**:

```json
{
  "strictNullChecks": true,
  "strictPropertyInitialization": true
}
```

**Common Patterns to Fix**:

```typescript
// ❌ Before
let name: string;
name = element.textContent();

// ✅ After (Option 1: Null coalescing)
let name: string;
name = element.textContent() || '';

// ✅ After (Option 2: Allow undefined)
let name: string | undefined;
name = element.textContent();

// ❌ Before (class property)
class User {
  name: string;
}

// ✅ After (initialize)
class User {
  name: string = '';
}
```

**Tasks**:

- [ ] Add null checks before accessing properties
- [ ] Initialize all class properties
- [ ] Use optional chaining (`?.`)
- [ ] Use nullish coalescing (`??`)
- [ ] Mark truly optional properties with `?`

### Phase 4: Enable Code Quality Checks (📋 Planned)

**Target Date**: Week of October 28, 2025  
**Estimated Effort**: 3-4 hours  
**Expected New Errors**: ~10-15

**Changes to Apply**:

```json
{
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noUncheckedIndexedAccess": true
}
```

**Tasks**:

- [ ] Remove unused imports
- [ ] Remove unused variables
- [ ] Prefix intentionally unused params with `_`
- [ ] Add array bounds checks
- [ ] Clean up dead code

### Phase 5: Enable Full Strict Mode (🎯 Goal)

**Target Date**: Week of November 4, 2025  
**Estimated Effort**: 1-2 hours  
**Expected New Errors**: 0

**Final Configuration**:

```json
{
  "strict": true // Enable full strict mode
}
```

**Tasks**:

- [ ] Enable `"strict": true`
- [ ] Remove individual strict flags (covered by `strict`)
- [ ] Final verification with full test suite
- [ ] Update documentation
- [ ] Celebrate completion! 🎉

### CI/CD Integration

Add to GitHub Actions / Jenkins pipeline:

```yaml
- name: TypeScript Type Check
  run: npm run typecheck

- name: Run Tests
  run: npm run test
```

### Progress Tracking

| Phase   | Target Date  | Status         | Errors    | Effort | Notes                     |
| ------- | ------------ | -------------- | --------- | ------ | ------------------------- |
| Phase 0 | Oct 3, 2025  | ✅ Complete    | 10 → 10   | 2h     | Baseline established      |
| Phase 1 | Oct 7, 2025  | 🔄 In Progress | 10 → 0    | 2-4h   | Fix basic errors          |
| Phase 2 | Oct 14, 2025 | 📋 Planned     | 0 → ~15   | 4-6h   | Enable noImplicitAny      |
| Phase 3 | Oct 21, 2025 | 📋 Planned     | ~15 → ~35 | 6-8h   | Enable strict null checks |
| Phase 4 | Oct 28, 2025 | 📋 Planned     | ~35 → ~45 | 3-4h   | Enable code quality       |
| Phase 5 | Nov 4, 2025  | 🎯 Goal        | ~45 → 0   | 1-2h   | Full strict mode          |

**Total Estimated Effort**: 18-24 hours over 5 weeks

### Rollback Plan

- **Per-Phase Rollback**: Can revert individual phase changes if issues arise
- **Git History**: Each phase committed separately for easy revert
- **Flag Toggle**: Can temporarily disable specific checks if blocking critical work
- **Documentation**: Each phase documented for clear understanding

### Success Metrics

- ✅ Phase 0: Established baseline with 10 errors
- ⏳ Phase 1: Zero errors with basic config
- ⏳ Phase 2: All implicit `any` types removed
- ⏳ Phase 3: All null/undefined cases handled
- ⏳ Phase 4: All unused code removed
- ⏳ Phase 5: Full strict mode with zero errors

## Notes

### Related Links

- [ADR-002: TypeScript Strict Mode](./0002-typescript-strict-mode.md)
- [Progressive Strictness Plan](../TYPESCRIPT_PROGRESSIVE_STRICTNESS.md)
- [TypeScript Strict Mode Documentation](https://www.typescriptlang.org/tsconfig#strict)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)

### Configuration Philosophy

```
┌─────────────────────────────────────────────────┐
│  Progressive Strictness Strategy                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Phase 0: Foundation                            │
│  ┌─────────────────────────────┐               │
│  │ Essential Type Safety       │ ✅ Completed  │
│  │ - Function types            │               │
│  │ - This binding              │               │
│  │ - Return types              │               │
│  └─────────────────────────────┘               │
│           ↓                                     │
│  Phase 1: Fix Basic Errors                     │
│  ┌─────────────────────────────┐               │
│  │ Zero Error Baseline         │ 🔄 In Progress│
│  │ - Fix remaining 10 errors   │               │
│  └─────────────────────────────┘               │
│           ↓                                     │
│  Phase 2: Explicit Types                       │
│  ┌─────────────────────────────┐               │
│  │ No Implicit Any             │ 📋 Planned    │
│  │ - Require explicit types    │               │
│  └─────────────────────────────┘               │
│           ↓                                     │
│  Phase 3: Null Safety                          │
│  ┌─────────────────────────────┐               │
│  │ Strict Null Checks          │ 📋 Planned    │
│  │ - Handle null/undefined     │               │
│  └─────────────────────────────┘               │
│           ↓                                     │
│  Phase 4: Code Quality                         │
│  ┌─────────────────────────────┐               │
│  │ Remove Dead Code            │ 📋 Planned    │
│  │ - Clean unused vars         │               │
│  └─────────────────────────────┘               │
│           ↓                                     │
│  Phase 5: Full Strict Mode                     │
│  ┌─────────────────────────────┐               │
│  │ Complete Type Safety        │ 🎯 Goal       │
│  │ - strict: true              │               │
│  └─────────────────────────────┘               │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Best Practices During Transition

**DO**:

- ✅ Write new code with strict types even before strict mode enabled
- ✅ Run `npm run typecheck` before committing
- ✅ Fix type errors as you encounter them
- ✅ Use proper types instead of `any`
- ✅ Document complex types with interfaces

**DON'T**:

- ❌ Add new type errors during transition
- ❌ Use `@ts-ignore` to bypass errors
- ❌ Use `any` type unless absolutely necessary
- ❌ Skip type checking in development
- ❌ Wait for phases to complete before writing good types

### Example: Writing Future-Proof Code

```typescript
// ❌ BAD: Will fail in future phases
function processData(data) {
  return data.map((item) => item.value);
}

// ✅ GOOD: Ready for strict mode
interface DataItem {
  value: number;
  name: string;
}

function processData(data: DataItem[]): number[] {
  return data.map((item) => item.value);
}

// ❌ BAD: Null/undefined issues
let config: Config;
config.apiUrl = getUrl();

// ✅ GOOD: Explicit handling
let config: Config | undefined;
config = loadConfig();
if (config) {
  const url = config.apiUrl;
}
```

### Architecture Impact

**Before Progressive Strictness**:

```
No tsconfig.json
  ↓
No compile-time checking
  ↓
Potential type errors at runtime
  ↓
Harder to maintain
```

**After Progressive Strictness**:

```
tsconfig.json with progressive flags
  ↓
Gradual improvement in type safety
  ↓
Catch errors at compile time
  ↓
Easier to maintain, fewer runtime bugs
```

### Future Considerations

- **Automated Phase Triggers**: Consider automated PR checks for each phase
- **Phase Documentation**: Update ADR as each phase completes
- **Team Training**: Schedule TypeScript workshops during transition
- **Tooling**: Consider ESLint rules that align with strictness levels
- **Monitoring**: Track type error trends over time

### Update History

- **2025-10-03**: ADR created, Phase 0 completed
- **Next review**: After Phase 1 completion (Week of Oct 7)
- **Final review**: After Phase 5 completion (Week of Nov 4)

---

**Implementation Status**: Phase 0 completed successfully. Progressive strictness strategy established with clear path to full strict mode over 5 weeks. Baseline of 10 errors achieved, ready to proceed with Phase 1.
