---
name: add-jsdoc
description: 'Add or fix JSDoc documentation for all public methods in WebActions or Page Object files — detects missing docs, incomplete @param/@returns tags, and Spanish text. Use when: documenting a new file, fixing JSDoc coverage, translating Spanish docs to English.'
argument-hint: 'File path to document (e.g. "pageObjectsManagers/cinesa/navbar/navbar.page.ts")'
---

# Add JSDoc Documentation

Add complete, consistent JSDoc to all undocumented or partially documented public methods in the target file.

## Audit Checklist

For each public method, check:
- Missing JSDoc block entirely
- Missing `@param` for each typed parameter
- Missing `@returns` with type and description
- `@returns` written in Spanish → translate to English
- Missing class-level JSDoc

## Standard Formats

### Class-level

```typescript
/**
 * Represents the [Component] page for [Platform/purpose].
 * This class only uses WebActions — never accesses Playwright API directly (ADR-0009).
 */
```

### Public method with params

```typescript
/**
 * [Verb] [what it does].
 *
 * @param {Type} name - Description.
 * @returns {Promise<ReturnType>} What resolves.
 */
```

### Boolean returns

```typescript
/** @returns {Promise<boolean>} True if X, false otherwise. */
```

## Rules

- All text in **English** — translate any existing Spanish descriptions
- Follow `.github/instructions/jsdoc.instructions.md` for full conventions
