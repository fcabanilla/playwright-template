---
name: add-cinema-config
description: 'Add a new cinema to the parametrized test configuration with environment-aware availability. Use when: onboarding a new cinema location, adding a cinema to the test matrix, updating cinema availability per environment.'
argument-hint: 'Cinema name and which environments it is available in (e.g. "Oasiz in production and preprod")'
---

# Add Cinema Configuration

Add a new cinema to the framework. The user will provide the cinema name and environment availability.

## Steps

### 1. Update `config/cinemas.config.ts`

Add a new entry to `AVAILABLE_CINEMAS`:

```typescript
{
  name: '{cinemaName}',
  selectMethod: 'select{CinemaName}Cinema',
  tags: ['@{cinemaName}'],
  availableInEnvironments: ['production', 'lab', 'preprod'],
}
```

Adjust `availableInEnvironments` based on user input.

### 2. Add Selection Method to Cinema Page Object

In `pageObjectsManagers/cinesa/cinemas/cinemas.page.ts`, add the selection method using `allure.step()` and `WebActions`.

### 3. Add Selector

In `pageObjectsManagers/cinesa/cinemas/cinemas.selectors.ts`, add the selector key for the cinema option.

### 4. Verify Parametrization

Existing parametrized tests using `getCinemasForEnvironment()` will automatically include the new cinema. Suggest verification commands.

## Reference

Follow naming conventions from `.github/copilot-instructions.md`.
