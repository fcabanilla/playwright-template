````prompt
---
description: 'Add or fix JSDoc documentation for all public methods in a specific WebActions or Page Object file'
---

# Add JSDoc Documentation

Add complete, consistent JSDoc to all undocumented or partially documented public methods in the target file.

## Target file: ${input:filePath}

## Instructions

1. **Read the file** and identify all public methods (including `async`)
2. **Check each method** for:
   - Missing JSDoc block entirely
   - Missing `@param` for each typed parameter
   - Missing `@returns` with type and description
   - `@returns` written in Spanish → translate to English
   - Missing class-level JSDoc
3. **Apply the standard format:**

### Class-level (if missing)

```typescript
/**
 * Represents the [Component] page/service for [Platform/purpose].
 * [One sentence about what it does.]
 * This class only uses WebActions — never accesses Playwright API directly (ADR-0009).
 *
 * @example
 * ```typescript
 * const component = new ComponentPage(webActions);
 * await component.navigateTo();
 * ```
 */
```

### Constructor (if missing)

```typescript
/**
 * Creates a new [ClassName] instance.
 *
 * @param {Page} page - The Playwright Page object.
 * @param {string} [baseUrl] - Optional base URL override.
 */
```

### Public method — minimal

```typescript
/**
 * [Verb] [what it does].
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
```

### Public method — with params

```typescript
/**
 * [Verb] [what it does].
 *
 * @param {Type} name - Description.
 * @returns {Promise<ReturnType>} What resolves.
 * @throws {Error} When applicable condition occurs.
 */
```

### Boolean returns

```typescript
@returns {Promise<boolean>} True if X, false otherwise.
```

## Rules

- All text in **English** — translate any existing Spanish descriptions
- Do NOT add `@author`, `@since`, or `@version`
- Private methods: single-line summary only, no tags
- Do NOT modify any actual code — only add/fix JSDoc comments
- Reference model: `core/webactions/webActions.ts`
````
