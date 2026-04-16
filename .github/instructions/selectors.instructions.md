---
applyTo: 'pageObjectsManagers/**/*.selectors.ts'
---

# Selector File Rules

## Structure

Define a TypeScript interface and export a typed const object:

```typescript
export interface ComponentSelectors {
  container: string;
  actionButton: string;
  title: string;
}

export const componentSelectors: ComponentSelectors = {
  container: '[data-testid="component"]',
  actionButton: '[data-testid="action-btn"]',
  title: '.component-title',
};
```

## Naming

- Export name: `{component}Selectors` (camelCase) — e.g., `navbarSelectors`, `seatPickerSelectors`
- Interface name: `{Component}Selectors` (PascalCase)
- Keys: camelCase describing the element's purpose (e.g., `loginButton`, `confirmSeatsButton`), not its position

## Selector Strategy (priority order)

1. `data-testid` attributes: `[data-testid="navbar-logo"]`
2. Semantic attributes: `a[href="/cines/"]`, `[role="dialog"]`, `[aria-label="close"]`
3. Meaningful CSS classes: `.v-seat-picker-seat`, `.header-sign-in`
4. CSS combinators as last resort: `header .logo a:first-child`

Never use fragile positional selectors like `nth-child(3)` or `div > div > span`.

## Multi-language / Multi-variant Selectors

For elements with text in multiple languages, use comma-separated `has-text()`:

```typescript
modalAcceptButton: 'button:has-text("Aceptar"), button:has-text("Accept"), button:has-text("Continuar")',
```

## Reference Models

- Simple: `pageObjectsManagers/cinesa/navbar/navbar.selectors.ts`
- Complex: `pageObjectsManagers/cinesa/seatPicker/seatPicker.selectors.ts`
