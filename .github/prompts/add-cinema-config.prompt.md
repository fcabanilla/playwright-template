---
description: 'Add a new cinema to the parametrized test configuration with environment-aware availability'
---

# Add Cinema Configuration

Add a new cinema called **${input:cinemaName}** to the framework.

## Steps

### 1. Update `config/cinemas.config.ts`

Add a new entry to `AVAILABLE_CINEMAS`:

```typescript
{
  name: '${input:cinemaName}',
  selectMethod: 'select${input:cinemaName}Cinema',
  tags: ['@${input:cinemaName}'],
  availableInEnvironments: ['production', 'lab', 'preprod'],
}
```

Adjust `availableInEnvironments` based on which environments the cinema exists in.

### 2. Add Selection Method to Cinema Page Object

In the cinema POM (`pageObjectsManagers/cinesa/cinemas/cinemas.page.ts`), add:

```typescript
async select${input:cinemaName}Cinema(): Promise<void> {
  await allure.step('Select ${input:cinemaName} cinema', async () => {
    await this.webActions.click(this.selectors.${input:cinemaName}CinemaOption);
  });
}
```

### 3. Add Selector

In `pageObjectsManagers/cinesa/cinemas/cinemas.selectors.ts`, add the selector key for the cinema option.

### 4. Verify Parametrization

Existing parametrized tests using `getCinemasForEnvironment()` will automatically include the new cinema. Verify with:

```bash
npm run report:clean:results
npx playwright test --grep "@${input:cinemaName}" --project='Cinesa'
npm run report
```

Follow all naming conventions from `.github/copilot-instructions.md`.
