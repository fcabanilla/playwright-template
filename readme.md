# Playwright Template for Automated Testing

This project is a modern base template for building scalable, maintainable automated tests using [Playwright](https://playwright.dev/). It incorporates best practices like the Page Object Model, custom fixtures, automated reporting with Allure, and CI/CD integration.

## Table of Contents

- [Playwright Template for Automated Testing](#playwright-template-for-automated-testing)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Project Structure](#project-structure)
  - [Usage](#usage)
    - [Running Tests](#running-tests)
    - [Allure Reporting](#allure-reporting)
    - [Custom Fixtures](#custom-fixtures)
  - [Configuration](#configuration)
  - [Best Practices](#best-practices)
  - [CI/CD Integration](#cicd-integration)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **Modular Architecture:** Uses the Page Object Model to separate test logic from UI selectors.
- **Custom Fixtures:** Pre-configured fixtures for initializing browser instances and page objects.
- **Automated Reporting:** Integrated with Allure Reporter for detailed test reporting.
- **Cross-Browser Testing:** Easily run tests on Chromium, Firefox, and WebKit.
- **Data-Driven Testing:** Extendable to support dynamic test data.
- **CI/CD Ready:** Designed for smooth integration into continuous integration pipelines.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd playwright-template
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Playwright browsers:**

   ```bash
   npx playwright install
   ```


## Project Structure

```plaintext
playwright-template/
├── fixtures/                        # Custom fixtures
│   └── cinesa/
│       └── playwright.fixtures.ts   # Fixture config
├── pageObjectsManagers/             # Page Objects Manager (POM)
│   └── cinesa/                      # Cinesa-specific
│       ├── navbar/                  # Navbar component
│       │   ├── navbar.page.ts
│       │   └── navbar.selectors.ts
│       ├── cookies/
│       ├── footer/
│       ├── login/
│       ├── signup/
│       ├── cinemas/
│       ├── movies/
│       ├── seatPicker/
│       ├── ticketPicker/
│       ├── paymentPage/
│       ├── purchaseSummary/
│       ├── bar/
│       ├── blog/
│       ├── programs/
│       ├── mailing/
│       └── generic/
├── tests/                           # Test cases
│   └── cinesa/                      # Cinesa tests
│       ├── navbar/
│       │   ├── navbar.spec.ts
│       │   ├── navbar.data.ts
│       │   └── navbar.assertions.ts
│       ├── footer/
│       ├── login/
│       ├── signup/
│       ├── cinemas/
│       ├── movies/
│       ├── seatPicker/
│       ├── ticketPicker/
│       ├── paymentPage/
│       ├── purchaseSummary/
│       ├── bar/
│       ├── blog/
│       ├── programs/
│       └── mailing/
├── allure-results/                  # Allure raw results
├── allure-report/                   # Allure HTML reports
├── test-results/                    # Playwright native results
├── playwright.config.ts             # Main config
├── eslint.config.js                 # ESLint config
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript config
└── readme.md                        # Project docs
```

## Usage

### Running Tests

- **Run all tests:**

  ```bash
  npm test
  # or
  yarn test
  ```

- **Run tests for a specific file:**

  ```bash
  npx playwright test tests/cinesa/navbar.spec.ts
  ```

- **Run tests in UI mode:**

  ```bash
  npx playwright test --ui
  ```

- **Run tests in a specific browser (e.g., Chromium):**

  ```bash
  npx playwright test --project=chromium
  ```

### Allure Reporting

- **Generate and open the report:**

  ```bash
  npm run report
  ```

- **Watch report mode:**

  ```bash
  npm run watch-report
  ```

### Custom Fixtures

We leverage custom fixtures to streamline test setup. For example, in `fixtures/playwright.fixtures.ts`:

```typescript
// fixtures/playwright.fixtures.ts
import { test as base, Page } from '@playwright/test';
import { Navbar } from '../../pageObjectsManagers/cinesa/navbar';
import { CookieBanner } from '../../pageObjectsManagers/cinesa/cookieBanner';

type MyFixtures = {
  navbar: Navbar;
  cookieBanner: CookieBanner;
};

export const test = base.extend<MyFixtures>({
  // Fixture for Navbar instance
  navbar: async ({ page }, use) => {
    const navbar = new Navbar(page);
    await use(navbar);
  },
  // Fixture for CookieBanner instance
  cookieBanner: async ({ page }, use) => {
    const cookieBanner = new CookieBanner(page);
    await use(cookieBanner);
  },
});

export { expect } from '@playwright/test';
```

Then, in your tests you can import these fixtures to simplify setup:

```typescript
// tests/cinesa/navbar.spec.ts
import { test, expect } from '../fixtures';
import {
  assertNavbarElementsVisible,
  assertHomeUrl,
  assertNavClick,
  assertExternalNavClick,
} from './navbar.assertions';
import { baseUrl, internalNavItems, externalNavItem } from './navbar.data';

test.describe('Cinesa Navbar Tests', () => {
  test.beforeEach(async ({ navbar, cookieBanner }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('should display all navbar elements', async ({ navbar, page }) => {
    await assertNavbarElementsVisible(page, navbar.selectors);
  });

  test('should click logo and stay on home', async ({ navbar, page }) => {
    await navbar.clickLogo();
    await assertHomeUrl(page, baseUrl);
  });

  test('should click each navbar element and navigate accordingly', async ({
    navbar,
    page,
  }) => {
    for (const item of internalNavItems) {
      await assertNavClick(
        page,
        navbar.selectors[item.selectorKey],
        item.expectedUrl
      );
      await navbar.navigateToHome();
    }
    await assertExternalNavClick(
      page,
      navbar.selectors[externalNavItem.selectorKey],
      externalNavItem.expectedUrl
    );
  });
});
```

## Configuration

The main configuration is defined in `playwright.config.ts`. You can adjust:

- **Projects and Browsers:** Configure projects for Chromium, Firefox, and WebKit.
- **Timeouts and Retries:** Set global timeouts and retry logic.
- **Reporters:** Configure Allure or other reporters.
- **Parallel Execution:** Control concurrency settings for optimal test performance.

## Best Practices

- **Page Object Model (POM):** Maintain a clear separation between UI selectors (in pageObjectsManagers) and test logic.
- **Reusable Fixtures:** Centralize setup and teardown in custom fixtures to reduce duplication.
- **Data-Driven Testing:** Use test data files and parameterized tests.
- **Step Annotations:** Use `test.step` to clearly document key actions, aiding in debugging and reporting.
- **Error Handling:** Include robust error capture and logging mechanisms.
- **CI/CD Integration:** Design your tests to run seamlessly in CI pipelines, ensuring fast feedback.
- **Centralized Configuration:** Use `playwright.config.ts` for global settings like base URLs and timeouts.

## CI/CD Integration

Integrate this template into your CI/CD pipeline (e.g., GitHub Actions, GitLab CI, Jenkins). Here’s an example workflow for GitHub Actions:

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      - run: npm install
      - run: npx playwright install
      - run: npm test
```

## Contributing

1. Fork the repository.
2. Create a branch for your feature or fix.
3. Commit your changes and push your branch.
4. Open a pull request with a detailed description of your changes.

## License

[Specify the license here]

---

## 🚦 Ejecución rápida: Producción vs Preproducción

> **¿Cómo corro los tests en cada ambiente?**

### 🔵 Producción (sin Cloudflare, sin login manual)

- Simplemente ejecuta:

```bash
npm run test:cinesa
```

O para ver el navegador:

```bash
npx playwright test --project=Cinesa --headed
```

No necesitas generar archivos de sesión ni hacer login manual. Todo funciona directo contra producción.

---

### 🟠 Preproducción (con Cloudflare, requiere login manual)

1. **Genera el archivo de sesión:**
   ```bash
   npx playwright test tests/cinesa/cloudflare/auth.saveState.spec.ts --headed
   ```
   - Se abrirá el navegador, haz login y pasa Cloudflare manualmente.
   - El script guardará el estado en `loggedInState.preprod.json`.

2. **Ejecuta los tests normalmente:**
   ```bash
   npm run test:cinesa:preprod
   # o
   npx playwright test --project=Cinesa --headed --workers=1
   ```
   - Ahora los tests usarán el estado guardado y saltarán login/Cloudflare.

---

> **Tip:** Para staging/dev existen scripts similares (`test:cinesa:staging`, `test:cinesa:dev`).

---

## 📋 **Contexto Detallado del Proyecto**

## 🏷️ **Información General**

- **Proyecto**: Playwright Template para Cinesa
- **Tipo**: Framework de automatización de pruebas E2E (End-to-End)
- **Framework**: Playwright + TypeScript
- **Autor**: fcabanilla
- **Repositorio**: [https://github.com/fcabanilla/playwright-template.git](https://github.com/fcabanilla/playwright-template.git)
- **Objetivo**: Template base moderno y escalable para construir pruebas automatizadas mantenibles usando Playwright con mejores prácticas

---

## 🏗️ **Arquitectura del Proyecto**

### **Stack Tecnológico**

| Tecnología     | Propósito                     | Versión  |
| -------------- | ----------------------------- | -------- |
| **Playwright** | Framework de automatización   | ^1.50.1  |
| **TypeScript** | Lenguaje principal            | 5.8.2    |
| **Allure**     | Reportes avanzados            | 3.2.0    |
| **ESLint**     | Linter de código              | 9.21.0   |
| **Prettier**   | Formateador de código         | 3.5.3    |
| **Node.js**    | Runtime de JavaScript         | 22.13.8  |
| **Dotenv**     | Gestión de variables entorno  | ^16.5.0  |
| **ImapFlow**   | Cliente IMAP para email tests | ^1.0.188 |

### **Estructura de Directorios**

```plaintext
playwright-template/
├── 📁 fixtures/                        # Fixtures personalizados
│   └── 📁 cinesa/
│       └── playwright.fixtures.ts      # Configuración de fixtures
├── 📁 pageObjectsManagers/             # Page Objects Manager (POM)
│   └── 📁 cinesa/                      # Específicos para Cinesa
│       ├── 📁 navbar/                  # Componente navegación
│       │   ├── navbar.page.ts          # Clase de página navbar
│       │   └── navbar.selectors.ts     # Selectores de navbar
│       ├── 📁 cookies/                 # Gestión de cookies
│       ├── 📁 footer/                  # Componente footer
│       ├── 📁 login/                   # Página de login
│       ├── 📁 signup/                  # Página de registro
│       ├── 📁 cinemas/                 # Gestión de cines
│       ├── 📁 movies/                  # Gestión de películas
│       ├── 📁 seatPicker/              # Selector de asientos
│       ├── 📁 ticketPicker/            # Selector de tickets
│       ├── 📁 paymentPage/             # Página de pago
│       ├── 📁 purchaseSummary/         # Resumen de compra
│       ├── 📁 bar/                     # Página del bar
│       ├── 📁 blog/                    # Blog y contenido
│       ├── 📁 programs/                # Programas especiales
│       ├── 📁 mailing/                 # Gestión de mailings
│       └── 📁 generic/                 # Componentes genéricos
├── 📁 tests/                           # Casos de prueba
│   └── 📁 cinesa/                      # Tests específicos de Cinesa
│       ├── 📁 navbar/                  # Tests de navegación
│       │   ├── navbar.spec.ts          # Especificaciones
│       │   ├── navbar.data.ts          # Datos de prueba
│       │   └── navbar.assertions.ts    # Aserciones
│       ├── 📁 footer/                  # Tests del footer
│       ├── 📁 login/                   # Tests de login
│       ├── 📁 signup/                  # Tests de registro
│       ├── 📁 cinemas/                 # Tests de cines
│       ├── 📁 movies/                  # Tests de películas
│       ├── 📁 seatPicker/              # Tests selector asientos
│       ├── 📁 ticketPicker/            # Tests selector tickets
│       ├── 📁 paymentPage/             # Tests página pago
│       ├── 📁 purchaseSummary/         # Tests resumen compra
│       ├── 📁 bar/                     # Tests del bar
│       ├── 📁 blog/                    # Tests del blog
│       ├── 📁 programs/                # Tests de programas
│       └── 📁 mailing/                 # Tests de mailing
├── 📁 allure-results/                  # Resultados crudos de Allure
├── 📁 allure-report/                   # Reportes HTML generados
├── 📁 test-results/                    # Resultados nativos Playwright
├── 📄 playwright.config.ts             # Configuración principal
├── 📄 eslint.config.js                 # Configuración ESLint
├── 📄 package.json                     # Dependencias y scripts
├── 📄 tsconfig.json                    # Configuración TypeScript
└── 📄 readme.md                        # Documentación del proyecto
```

---

## 🎯 **Patrones de Diseño Implementados**


### Main Patterns (Examples)

- **Page Object Model (POM):** Modular classes for each UI component, with TypeScript interfaces for selectors and JSDoc documentation.
- **Custom Fixtures:** Over 20 fixtures for all components, available in all tests via Playwright's `base.extend`.
- **Data-Driven Testing:** Test data and selectors are separated from test logic, using TypeScript interfaces for type safety.
- **Reusable Assertions:** Dedicated assertion classes for each component, with Allure steps for detailed reporting.

---

## 🛤️ **Flujo Completo de Ejecución Avanzado**

### **1. 🚀 Inicialización Optimizada**

#### **Configuración de Alto Rendimiento**

```typescript
// playwright.config.ts
export default defineConfig({
  timeout: 60000, // 60s timeout por test
  fullyParallel: true, // Paralelización completa
  workers: 5, // 5 workers optimizados
  use: {
    headless: false, // Visual por defecto
    screenshot: 'only-on-failure', // Screenshots selectivos
    video: 'on', // Videos siempre
    actionTimeout: 60000, // 60s para acciones
    navigationTimeout: 60000, // 60s para navegación
  },
});
```

### **2. 🎭 Multi-Component Setup**

```typescript
// Ejemplo de test complejo con múltiples fixtures
test('Complete purchase flow', async ({
  navbar,
  cookieBanner,
  seatPicker,
  ticketPicker,
  paymentPage,
  purchaseSummary,
}) => {
  // Setup automático de 6 componentes
  await navbar.navigateToHome();
  await cookieBanner.acceptCookies();

  // Flujo de compra completo
  await seatPicker.selectSeats(2);
  await ticketPicker.selectTickets();
  await paymentPage.completePayment();
  await purchaseSummary.verifyPurchase();
});
```

### **3. 📈 Reportes Avanzados con Allure**

```typescript
// Configuración avanzada de Allure
reporter: [
  ['line'],
  [
    'allure-playwright',
    {
      detail: false,
      outputFolder: 'allure-results',
      suiteTitle: false,
      links: {
        issue: {
          nameTemplate: 'Issue #%s',
          urlTemplate: 'https://issues.example.com/%s',
        },
        tms: {
          nameTemplate: 'TMS #%s',
          urlTemplate: 'https://tms.example.com/%s',
        },
        jira: {
          urlTemplate: (v) => `https://jira.example.com/browse/${v}`,
        },
      },
    },
  ],
],
```

---

## 🚀 **Scripts NPM Especializados**


### Main NPM Scripts

- `test` / `test:navbar` / `test:movies` / ...: Run all or specific component tests
- `ui`: Playwright UI mode
- `lint`: Run ESLint
- `report`: Generate and open Allure report
- `watch-report`: Live Allure report
- `codegen`: Playwright codegen for selectors

---

## 🔧 **Configuraciones Avanzadas**


### Tooling

- ESLint + Prettier for code quality
- TypeScript strict mode
- Allure for advanced reporting

---

## 📊 **Cobertura de Funcionalidades**

### Implemented Components

- Navbar, Footer, Login/Signup, Movies, Cinemas, SeatPicker, TicketPicker, PaymentPage, PurchaseSummary, Bar, Blog, Programs, Promotions, Experiences, Coupons, Mailing, Cookies, and more (20+ total)
---

## 🔄 **Comparación con demo-cinesa**

### **Ventajas del playwright-template**

| Aspecto                | demo-cinesa          | playwright-template     |
| ---------------------- | -------------------- | ----------------------- |
| **Arquitectura**       | POM Básico           | POM Manager Avanzado    |
| **Fixtures**           | 3 fixtures           | 20+ fixtures            |
| **Tipado**             | Parcial              | Completo con Interfaces |
| **Documentación**      | Básica               | JSDoc completa          |
| **Datos de Prueba**    | Integrados en tests  | Archivos separados      |
| **Aserciones**         | En tests             | Classes dedicadas       |
| **Linting**            | No configurado       | ESLint + Prettier       |
| **Modularidad**        | Monolítica           | Altamente modular       |
| **Scripts NPM**        | 6 scripts            | 40+ scripts específicos |
| **Cobertura**          | Registro únicamente  | 20+ componentes         |
| **Email Testing**      | No implementado      | ImapFlow integrado      |
| **Environment Config** | Variables de entorno | URL hardcodeada         |

### **Áreas de Mejora Potencial**

1. **Gestión de Ambientes**: Implementar configuración por ambientes como demo-cinesa
2. **Variables de Entorno**: Usar dotenv para configuración dinámica
3. **Base Test Pattern**: Adoptar el patrón de BaseTest de demo-cinesa
4. **WebActions Wrapper**: Implementar wrapper de acciones como demo-cinesa


- **Cobertura 7x Mayor**: 20+ componentes vs 3 páginas
- **Arquitectura Modular**: Separación completa de responsabilidades
- **Calidad Enterprise**: Linting, tipado completo, documentación
- **Developer Experience**: Herramientas avanzadas de desarrollo
- **Testing Especializado**: Fixtures y aserciones dedicadas

La combinación de ambos enfoques resultaría en el framework de testing definitivo para Cinesa.

---

## 📝 **Metadata del Proyecto**

- **📝 Última actualización**: 4 de agosto de 2025
- **🔖 Versión del documento**: 1.0
- **👨‍💻 Mantenido por**: fcabanilla
- **🏢 Organización**: Cinesa Testing Team
- **📊 Cobertura**: 20+ componentes del sitio web
- **🚀 Estado**: Activo y en desarrollo continuo

---

## 📖 **Recursos Técnicos Adicionales**

- [Playwright Docs](https://playwright.dev/docs/intro)
- [Allure Framework](https://docs.qameta.io/allure/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Configuration](https://eslint.org/docs/user-guide/configuring/)
- [Prettier Integration](https://prettier.io/docs/en/integrating-with-linters.html)

---

Este README actualizado proporciona una guía completa para la instalación, configuración y ejecución de tests, integrando prácticas modernas y aprovechando las capacidades avanzadas de Playwright.


## Cloudflare Bypass & Session State Setup (Preproducción)

> **Importante:** Solo aplica para preproducción (producción no requiere este paso).

1. Ejecutá:
  ```bash
  npx playwright test tests/cinesa/cloudflare/auth.saveState.spec.ts --headed
  ```
  - Login manual y pasá Cloudflare. El estado se guarda en `loggedInState.preprod.json`.

2. Corré los tests normalmente usando ese storageState:
  ```bash
  npx playwright test --project='Cinesa' --headed --workers=1
  ```

**Notas:**
- No subas archivos de sesión reales al repo (`.gitignore`).
- Solo para preproducción con Cloudflare.
