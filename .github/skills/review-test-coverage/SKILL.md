---
name: review-test-coverage
description: 'Analyze test coverage across components and identify gaps based on existing tests, tag distribution, assertion files, and data file separation. Use when: evaluating coverage health, finding untested components, planning new tests, reviewing test quality per component.'
argument-hint: 'Platform to analyze (cinesa or uci) or specific component name'
---

# Review Test Coverage

Analyze the current state of test coverage across all components and platforms.

## Coverage Analysis Steps

1. **Scan existing test files:**
   - Count `*.spec.ts` files per component in `tests/{platform}/`
   - Count test cases per file (look for `test(` calls)
   - Identify components with zero explicit tests

2. **Check implicit coverage:**
   The booking flow provides implicit coverage for intermediate steps:
   Movies → Cinemas → SeatPicker → TicketPicker → Bar → PurchaseSummary → Payment

3. **Evaluate tag distribution:**
   - `@smoke`, `@critical`, `@e2e` — check each component has appropriate tags
   - Identify components missing priority tags

4. **Check assertion coverage:**
   - Does each `*.spec.ts` have a corresponding `*.assertions.ts`?
   - Are assertions using `allure.step()`?

5. **Check test data separation:**
   - Does each `*.spec.ts` have a corresponding `*.data.ts`?
   - Are URLs dynamic (not hardcoded)?

## Report Format

| Component | Tests | Assertions | Data | Tags | Gaps |
| --------- | ----- | ---------- | ---- | ---- | ---- |

## Reference

See `docs/coverage/` for existing coverage reports. Use `config/cinemas.config.ts` for cinema parametrization data.
