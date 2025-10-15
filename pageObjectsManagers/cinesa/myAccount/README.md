# My Account - Page Objects Implementation

Esta carpeta contiene la implementación de Page Objects para el área de **Mi Cuenta** de Cinesa, siguiendo estrictamente **ADR-0009** (Architectural Boundaries) y basándose en **ADR-0008** (My Account Testing Strategy).

## 📁 Estructura de Archivos

```bash
myAccount/
├── README.md                           # Este archivo
├── myAccount.types.ts                  # TypeScript interfaces y types
├── myAccountOverview.selectors.ts      # Selectores de la página overview
├── myAccountOverview.page.ts           # Page Object para overview
└── (próximos archivos para subsecciones)
```

## 🏗️ Arquitectura

### Cumplimiento de ADR-0009

Todos los Page Objects en esta carpeta siguen las reglas arquitectónicas:

1. **✅ No acceso directo a Playwright API**: Todos los Page Objects delegan a `WebActions`
2. **✅ Selectores separados**: Todos los selectores están en archivos `.selectors.ts`
3. **✅ Types definidos**: Interfaces y tipos en `myAccount.types.ts`
4. **✅ Responsabilidades claras**: Page Objects proporcionan métodos de alto nivel
5. **✅ Inyección por Fixtures**: Page Objects se inyectan via Playwright fixtures (no se instancian manualmente)

### Ejemplo de Uso Correcto

```typescript
// ❌ INCORRECTO (viola ADR-0009)
class MyAccountPage {
  async navigateToProfile() {
    await this.page.click('.profile-link'); // ❌ Acceso directo a page
  }
}

// ✅ CORRECTO (cumple ADR-0009)
class MyAccountOverviewPage {
  private readonly webActions: WebActions;

  async navigateToProfile() {
    await this.webActions.clickWithOverlayHandling(
      // ✅ Delega a WebActions
      MyAccountOverviewSelectors.navigation.profileCard
    );
  }
}
```

### 🔌 Inyección de Dependencias con Fixtures

**Los Page Objects NO se instancian manualmente**. En su lugar, se inyectan automáticamente via Playwright fixtures definidas en `fixtures/cinesa/playwright.fixtures.ts`.

#### ❌ INCORRECTO (No usar)

```typescript
test('my test', async ({ page }) => {
  // ❌ NO instanciar manualmente
  const myAccountPage = new MyAccountOverviewPage(page);
  const authenticatedNavbar = new AuthenticatedNavbarPage(page);
});
```

#### ✅ CORRECTO (Usar fixtures)

```typescript
test('my test', async ({ page, authenticatedNavbar, myAccountOverview }) => {
  // ✅ Fixtures inyectados automáticamente
  await authenticatedNavbar.navigateToMyAccount();
  await myAccountOverview.waitForPageLoad();
});
```

#### Fixtures Disponibles

| Fixture               | Tipo                      | Descripción                        |
| --------------------- | ------------------------- | ---------------------------------- |
| `authenticatedNavbar` | `AuthenticatedNavbarPage` | Navbar para usuario autenticado    |
| `myAccountOverview`   | `MyAccountOverviewPage`   | Página principal de My Account     |
| `loginPage`           | `LoginPage`               | Página/modal de login              |
| `navbar`              | `Navbar`                  | Navbar para usuario no autenticado |

#### Ejemplo Completo con Fixtures

```typescript
import { test, expect } from '../../../fixtures/cinesa/playwright.fixtures';

test('navigate to My Account', async ({
  page,
  loginPage,
  authenticatedNavbar,
  myAccountOverview,
}) => {
  // Login
  await page.click('button:has-text("Inicia sesión")');
  await loginPage.fillData();
  await loginPage.clickSubmit();
  await page.waitForLoadState('networkidle');

  // Navigate to My Account (usando fixture)
  await authenticatedNavbar.navigateToMyAccount();

  // Verify (usando fixture)
  const isOnPage = await myAccountOverview.isOnMyAccountPage();
  expect(isOnPage).toBe(true);
});
```

#### Helpers Disponibles

Se han creado helper functions que encapsulan flujos comunes:

**Ubicación**: `tests/cinesa/myAccount/myAccount.helpers.ts`

```typescript
import {
  loginAndNavigateToMyAccount,
  performCompleteLoginFlow,
} from './myAccount.helpers';

test('using helpers', async ({
  page,
  loginPage,
  authenticatedNavbar,
  myAccountOverview,
}) => {
  // Helper encapsula todo el flujo
  await performCompleteLoginFlow(
    page,
    loginPage,
    authenticatedNavbar,
    myAccountOverview
  );

  // Ya estás autenticado y en My Account
  const pageTitle = await myAccountOverview.getPageTitle();
  expect(pageTitle).toBeTruthy();
});
```

**Ver ejemplos completos en**: `tests/cinesa/myAccount/myAccountFixtures.example.spec.ts`

## 🗺️ Secciones de My Account (según ADR-0008)

### 1. Overview (Mi Área de Cliente)

**Archivo**: `myAccountOverview.page.ts`  
**URL**: `/mycinesa/mi-area-de-cliente/`  
**Responsabilidades**:

- Dashboard con información del usuario
- Navegación a las 6 subsecciones restantes
- Widgets de puntos, membership, bookings activos

### 2-7. Subsecciones (Pendientes de implementación)

| Subsección           | URL                                | Archivo (futuro)        |
| -------------------- | ---------------------------------- | ----------------------- |
| **Bookings**         | `/mycinesa/mis-entradas/`          | `bookings.page.ts`      |
| **Preferences**      | `/mycinesa/preferencias/`          | `preferences.page.ts`   |
| **Membership**       | `/mycinesa/mis-suscripciones/`     | `membership.page.ts`    |
| **Offers & Rewards** | `/mycinesa/ofertas-y-recompensas/` | `offersRewards.page.ts` |
| **Card Wallet**      | `/mycinesa/mis-tarjetas/`          | `cardWallet.page.ts`    |
| **Profile**          | `/mycinesa/mi-perfil/`             | `profile.page.ts`       |

## 🧪 Tests Asociados

**Ubicación**: `/tests/cinesa/myAccount/`

### myAccountNavigation.spec.ts

Tests de navegación y smoke tests:

- ✅ Login y navegación a My Account
- ✅ Verificación de cards de navegación visibles
- ✅ Navegación a cada subsección
- 🔜 Verificación de dashboard widgets (pendiente)

## 📝 Selectores

### Estrategia de Selectores

Los selectores fueron extraídos del código generado por **Playwright Codegen** y optimizados:

```typescript
// De Codegen:
await page.getByRole('button', { name: 'Inicia sesión' }).click();

// Optimizado en selectors.ts:
loginButton: 'button:has-text("Inicia sesión")',
```

### Prioridad de Selectores

1. **IDs específicos** (ej: `#v-member-sign-in-form-field__email-input`)
2. **Data attributes** (ej: `[data-section="bookings"]`)
3. **Classes específicas** (ej: `.v-member-sign-in-form`)
4. **Role-based** (ej: `button:has-text("Entrar")`)
5. **Combinaciones** (último recurso)

## 🔗 Integración con Navbar

La navegación a My Account se realiza a través de:

**AuthenticatedNavbarPage** → `navigateToMyAccount()` → **MyAccountOverviewPage**

```typescript
// Desde cualquier página después de login:
await authenticatedNavbar.navigateToMyAccount();

// Ahora estás en MyAccountOverviewPage
await myAccountPage.navigateToBookings();
```

## 🚀 Próximos Pasos

### 1. Ajustar selectores con HTML real

Una vez ejecutados los tests, los selectores en `.selectors.ts` necesitarán ajustes basándose en:

- Estructura HTML real de la página
- Atributos `data-testid` (si existen)
- Verificación de IDs y clases reales

### 2. Crear Page Objects para subsecciones

Seguir la misma estructura para cada subsección:

```
bookings.selectors.ts
bookings.types.ts
bookings.page.ts
```

### 3. Implementar tests críticos (ADR-0008)

Prioridad alta:

- COMS-6002: Change password (3 failures - CRÍTICO)
- OCG-2454: Loyalty points sync
- Booking history display
- Preferences update

### 4. Crear fixtures

Crear `myAccount.fixtures.ts` con estados pre-autenticados:

```typescript
export const myAccountFixture = test.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login automático
    await use(page);
  },
});
```

## 📚 Referencias

- **ADR-0008**: [My Account Area Testing Strategy](../../../docs/adrs/0008-my-account-area-testing-strategy.md)
- **ADR-0009**: [Page Object Architecture Rules](../../../docs/adrs/0009-page-object-architecture-rules.md)
- **WebActions**: [core/webactions/webActions.ts](../../../core/webactions/webActions.ts)

## ⚠️ Notas Importantes

### Login Flow Actual

El `LoginPage` existente tiene credenciales hardcodeadas en `fillData()`. Esto debe refactorizarse para aceptar parámetros:

```typescript
// TODO: Refactorizar LoginPage.fillData() para aceptar credenciales dinámicas
async fillData(email?: string, password?: string) {
  const credentials = {
    email: email || process.env.TEST_NO_MEMBERSHIP_EMAIL,
    password: password || process.env.TEST_NO_MEMBERSHIP_PASSWORD,
  };
  await this.webActions.fill(LOGIN_SELECTORS.emailInput, credentials.email);
  await this.webActions.fill(LOGIN_SELECTORS.passwordInput, credentials.password);
}
```

### Environment URL

El test usa `https://lab-web.ocgtest.es` hardcodeado temporalmente. Pendiente:

- Agregar configuración de environment LAB en `config/environments.ts`
- Actualizar `config/urls.ts` con helper para LAB

---

**Autor**: GitHub Copilot  
**Fecha**: Octubre 8, 2025  
**ADRs**: 0008, 0009  
**Branch**: `feature/my-account-implementation`
