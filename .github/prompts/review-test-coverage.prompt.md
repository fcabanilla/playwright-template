---
description: 'Analyze test coverage across components and identify gaps based on existing tests, booking flow implicit coverage, and ADR priorities'
---

# Review Test Coverage

Analyze the current state of test coverage across all components and platforms.

## Platform: ${input:platform}

### Coverage Analysis Steps

1. **Scan existing test files:**

   - Count `*.spec.ts` files per component in `tests/${input:platform}/`
   - Count test cases per file (look for `test(` calls)
   - Identify components with zero explicit tests

2. **Check implicit coverage:**
   The booking flow provides implicit coverage for intermediate steps even without dedicated tests:

   - Movies → Cinemas → **SeatPicker** → **TicketPicker** → **Bar** → **PurchaseSummary** → Payment
   - SeatPicker has 30 tests (100% coverage) — reference standard

3. **Evaluate by tag distribution:**

   ```bash
   grep -r "@smoke" tests/${input:platform}/ --include="*.spec.ts" -l | wc -l
   grep -r "@critical" tests/${input:platform}/ --include="*.spec.ts" -l | wc -l
   grep -r "@e2e" tests/${input:platform}/ --include="*.spec.ts" -l | wc -l
   ```

4. **Check assertion coverage:**

   - Does each `*.spec.ts` have a corresponding `*.assertions.ts`?
   - Are assertions using Allure steps?

5. **Check test data separation:**
   - Does each `*.spec.ts` have a corresponding `*.data.ts`?
   - Are URLs dynamic (not hardcoded)?

### Coverage Report Format

For each component, report:

| Component | Tests | Assertions File | Data File | Tags             | Gaps                |
| --------- | ----- | --------------- | --------- | ---------------- | ------------------- |
| navbar    | 15    | ✅              | ✅        | @smoke @critical | None                |
| movies    | 8     | ✅              | ✅        | @smoke           | Missing @e2e        |
| bar       | 0     | ❌              | ❌        | —                | Needs initial tests |

### Priority Guidance

Reference `TEST_COVERAGE_REPORT_OPTIMISTIC.md` for the current coverage roadmap.
