# Testplan JSON Schema Reference

## Schema

```typescript
interface TestPlanV1 {
  /** Must be exactly "1.0" */
  version: '1.0';

  /** Array of test entries to include in the execution */
  tests: TestPlanEntry[];
}

interface TestPlanEntry {
  /**
   * Test identifier. Can be:
   * - testCaseId (MD5 hash of fullName) — from allure results
   * - @allure.id value — if using allure.id() in tests
   * - Any string — used for tracking, not for matching
   */
  id: string | number;

  /**
   * Test selector — matched against the test's fullName.
   * This is what allure-playwright uses to filter tests.
   *
   * Format: "relativePath#suiteTitle testTitle"
   * The # is replaced with a space during regex conversion.
   */
  selector: string;
}
```

## How Selectors Work

### Format

```
<relative-file-path>#<describe-blocks> <test-title>
```

- **File path**: Relative to project's `testDir`, using forward slashes
- **`#`**: Separator between file path and test hierarchy
- **Describe blocks**: All nested `test.describe()` names, space-separated
- **Test title**: The full test name including middot separators

### Real Examples from This Project

```
seatPicker/seatPicker.spec.ts#Seat Picker - Seat Selection Seat Selection Validation Seat Picker · Seat Selection · Attempt selection · Separate group same row — Oasiz
```

Breaking it down:

- File: `seatPicker/seatPicker.spec.ts`
- Describe L1: `Seat Picker - Seat Selection`
- Describe L2: `Seat Selection Validation`
- Test: `Seat Picker · Seat Selection · Attempt selection · Separate group same row — Oasiz`

```
signup/signup.spec.ts#Signup Signup · Form · Validate · Mandatory fields
```

- File: `signup/signup.spec.ts`
- Describe: `Signup`
- Test: `Signup · Form · Validate · Mandatory fields`

```
navbar/navbar.spec.ts#Navbar - Navegación Principal Navegación Completa - DEMO Navbar · Navigation · Click each element · Navigate accordingly — DEMO
```

- File: `navbar/navbar.spec.ts`
- Describe L1: `Navbar - Navegación Principal`
- Describe L2: `Navegación Completa - DEMO`
- Test: `Navbar · Navigation · Click each element · Navigate accordingly — DEMO`

### Regex Conversion

`testPlanFilter()` transforms each selector:

1. Replace first `#` with space: `seatPicker/seatPicker.spec.ts Seat Picker - Seat Selection ...`
2. Escape regex special characters
3. Wrap: `/\s<escaped-pattern>$/`

This regex is passed to Playwright's `grep` which matches against the full test title path.

## Example testplan.json

### Minimal

```json
{
  "version": "1.0",
  "tests": [
    {
      "id": "1",
      "selector": "navbar/navbar.spec.ts#Navbar - Navegación Principal Navbar · Visibility · Display all elements"
    }
  ]
}
```

### Multiple Tests

```json
{
  "version": "1.0",
  "tests": [
    {
      "id": "7413d32af7144e232d3c75fc7d734ce7",
      "selector": "seatPicker/seatPicker.spec.ts#Seat Picker - Seat Selection Seat Selection Validation Seat Picker · Seat Selection · Attempt selection · Separate group same row — Oasiz"
    },
    {
      "id": "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
      "selector": "signup/signup.spec.ts#Signup Signup · Form · Validate · Mandatory fields"
    }
  ]
}
```

## Where fullName Comes From

In the Allure result JSON files (`.allure/results/*-result.json`):

```json
{
  "uuid": "0669193c-a588-47f1-b7b4-2c18abebaa1e",
  "testCaseId": "7413d32af7144e232d3c75fc7d734ce7",
  "fullName": "seatPicker/seatPicker.spec.ts#Seat Picker - Seat Selection ...",
  "name": "Seat Picker · Seat Selection · Attempt selection · ...",
  "status": "passed",
  "labels": [
    { "name": "epic", "value": "Cinesa Platform" },
    { "name": "tag", "value": "@seatpicker" },
    { "name": "tag", "value": "@e2e" }
  ]
}
```

The `generate-testplan.cjs` script reads these files and uses `fullName` as the `selector` and `testCaseId` as the `id`.

## Stability Notes

- **fullName can change** if you rename test files, rename `describe()` blocks, or rename test titles
- After refactoring tests, regenerate the testplan from fresh results
- The `id` field is for tracking only — selector matching is what determines execution
- If a selector doesn't match any test, that entry is silently ignored (no error)
