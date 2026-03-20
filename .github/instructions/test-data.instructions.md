---
applyTo: 'tests/**/*.data.ts'
---

# Test Data File Rules

## Dynamic Environment Configuration

Always get config dynamically at the top of the file:

```typescript
import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../config/environments';
// For UCI: import { getUCIConfig, UCIEnvironment } from '../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);
const cleanBaseUrl = config.baseUrl.endsWith('/')
  ? config.baseUrl.slice(0, -1)
  : config.baseUrl;
```

Never hardcode domains or URLs.

## Typed Data Exports

Define interfaces for test data:

```typescript
export interface NavItem {
  selectorKey: keyof ComponentSelectors;
  expectedUrl: string;
}
```

## URL Construction

Always dynamic with template literals:

```typescript
export const internalNavItems: NavItem[] = [
  { selectorKey: 'cines', expectedUrl: `${cleanBaseUrl}/cines/` },
  { selectorKey: 'peliculas', expectedUrl: `${cleanBaseUrl}/peliculas/` },
];
```

External URLs are the exception — use absolute strings for third-party domains.

## Cinema Parametrization

Import from centralized config:

```typescript
export type { CinemaConfig } from '../../../config/cinemas.config';
export {
  AVAILABLE_CINEMAS,
  getCinemasForEnvironment,
} from '../../../config/cinemas.config';
```

## Getter Functions

Export a getter for lazy evaluation and clean imports:

```typescript
export function getComponentData() {
  return { baseUrl: cleanBaseUrl, internalNavItems, externalNavItem };
}
```

## Reference Model

`tests/cinesa/navbar/navbar.data.ts`
