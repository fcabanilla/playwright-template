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
├── tests/                        // Automated tests (specs, assertions, test data)
│   └── cinesa/                   // Example tests for Cinesa project
│       ├── navbar.assertions.ts
│       ├── navbar.data.ts
│       ├── navbar.spec.ts
│       └── navbar.steps.ts
├── pageObjectsManagers/          // Page objects and selector managers
│   └── cinesa/
│       ├── cookieBanner.selectors.ts
│       ├── cookieBanner.ts
│       └── navbar.selectors.ts
├── fixtures/                     // Custom fixtures for test setup and teardown
│   └── playwright.fixtures.ts    // Custom Playwright fixtures (see below)
├── utils/                        // Helper functions and utilities
├── playwright.config.ts          // Global Playwright configuration
└── package.json                  // Project metadata and scripts
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

### **1. 🏛️ Page Object Manager (POM) Modular**

#### **Separación Avanzada de Responsabilidades:**

#### Selectores Tipados (TypeScript Interfaces)

```typescript
// pageObjectsManagers/cinesa/navbar/navbar.selectors.ts
export interface NavbarSelectors {
  logo: string;
  cines: string;
  peliculas: string;
  promociones: string;
  experiencias: string;
  programas: string;
  bonos: string;
  signup: string;
  signin: string;
}

export const navbarSelectors: NavbarSelectors = {
  logo: '.logo a',
  cines: 'nav.header-nav a[href="/cines/"]',
  peliculas: 'nav.header-nav a[href="/peliculas/"]',
  // ... más selectores
};
```

#### Classes de Páginas con Documentación JSDoc

```typescript
// pageObjectsManagers/cinesa/navbar/navbar.page.ts
/**
 * Represents the Cinesa website navigation bar component.
 * Provides methods to interact with navigation elements and navigate to different sections.
 */
export class Navbar {
  private readonly url: string = 'https://www.cinesa.es/';
  readonly page: Page;
  readonly selectors: NavbarSelectors;

  /**
   * Creates a new Navbar instance.
   * @param page - The Playwright page object to interact with.
   */
  constructor(page: Page) {
    this.page = page;
    this.selectors = navbarSelectors;
  }

  /**
   * Navigates to the Cinesa homepage.
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToHome(): Promise<void> {
    await allure.step('Navigate to Cinesa homepage', async () => {
      await this.page.goto(this.url);
    });
  }
}
```

**✅ Ventajas sobre demo-cinesa:**

- **Tipado Fuerte**: Interfaces TypeScript para mayor seguridad
- **Documentación**: JSDoc integrada en todos los métodos
- **Modularidad**: Cada componente en su propio directorio
- **Allure Integration**: Steps integrados directamente en métodos

### **2. 🧪 Custom Fixtures Pattern (Extensión Avanzada)**

```typescript
// fixtures/cinesa/playwright.fixtures.ts
type CustomFixtures = {
  navbar: Navbar;
  cookieBanner: CookieBanner;
  seatPicker: SeatPicker;
  footer: Footer;
  blogLanding: BlogLanding;
  cinema: Cinema;
  cinemaDetail: CinemaDetail;
  loginPage: LoginPage;
  ticketPicker: TicketPicker;
  barPage: BarPage;
  purchaseSummary: PurchaseSummary;
  paymentPage: PaymentPage;
  unlimitedProgramsPage: UnlimitedProgramsPage;
  signupPage: SignupPage;
  mailing: Mailing;
  // ... 20+ fixtures más
};

export const test = base.extend<CustomFixtures>({
  navbar: async ({ page }, use) => {
    const navbar = new Navbar(page);
    await use(navbar);
  },
  cookieBanner: async ({ page }, use) => {
    const cookieBanner = new CookieBanner(page);
    await use(cookieBanner);
  },
  // ... más fixtures
});
```

**✅ Beneficios avanzados:**

- **Fixtures Específicos**: 20+ componentes pre-configurados
- **Lazy Loading**: Instanciación bajo demanda
- **Type Safety**: Autocompletado completo en IDE
- **Reutilización Masiva**: Componentes disponibles en todos los tests

### **3. 📊 Data-Driven Testing Pattern**

```typescript
// tests/cinesa/navbar/navbar.data.ts
export interface NavItem {
  selectorKey: keyof NavbarSelectors;
  expectedUrl: string;
}

export const baseUrl = 'https://www.cinesa.es';

export const internalNavItems: NavItem[] = [
  { selectorKey: 'cines', expectedUrl: `${baseUrl}/cines/` },
  { selectorKey: 'peliculas', expectedUrl: `${baseUrl}/peliculas/` },
  { selectorKey: 'promociones', expectedUrl: `${baseUrl}/promociones/` },
  // ... más items
];

export const externalNavItem: NavItem = {
  selectorKey: 'bonos',
  expectedUrl: 'https://www.cinesabusiness.es/promociones.html',
};
```

**✅ Ventajas:**

- **Separación de Datos**: Tests y datos completamente separados
- **Tipado de Datos**: Interfaces para datos de prueba
- **Mantenibilidad**: Cambios centralizados
- **Escalabilidad**: Fácil agregar nuevos casos

### **4. 🔍 Assertions Pattern (Aserciones Dedicadas)**

```typescript
// tests/cinesa/navbar/navbar.assertions.ts
export class NavbarAssertions {
  constructor(private page: Page) {}

  async expectNavbarElementsVisible(): Promise<void> {
    await allure.step('Verify all navbar elements are visible', async () => {
      // Implementación de verificaciones
    });
  }

  async expectHomeUrl(baseUrl: string): Promise<void> {
    await allure.step('Verify home URL is correct', async () => {
      await expect(this.page).toHaveURL(baseUrl);
    });
  }

  async expectNavClick(selector: string, expectedUrl: string): Promise<void> {
    await allure.step(`Verify navigation to ${expectedUrl}`, async () => {
      await this.page.click(selector);
      await expect(this.page).toHaveURL(expectedUrl);
    });
  }
}
```

**✅ Beneficios:**

- **Aserciones Reutilizables**: Lógica de verificación centralizada
- **Allure Steps**: Reportes más detallados
- **Mantenimiento**: Un solo lugar para cambios
- **Legibilidad**: Tests más limpios y enfocados

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

### **Tests por Componente**

```json
{
  "test:navbar": "npx playwright test tests/cinesa/navbar/navbar.spec.ts",
  "test:seatpicker": "playwright test tests/cinesa/seatPicker/seatPicker.spec.ts",
  "test:programs": "playwright test tests/cinesa/programs/programs.spec.ts",
  "test:footer": "npx playwright test tests/cinesa/footer.spec.ts",
  "test:blog": "npx playwright test tests/cinesa/blog.spec.ts",
  "test:signup": "npx playwright test tests/cinesa/signup/signup.spec.ts",
  "test:movies": "npx playwright test tests/cinesa/movies/movies.spec.ts",
  "test:cinemas": "npx playwright test tests/cinesa/cinemas/cinemas.spec.ts"
}
```

### **Herramientas de Desarrollo**

```json
{
  "ui": "npx playwright test --ui",
  "lint": "eslint . --ext .ts,.js",
  "report": "npx allure generate allure-results -o allure-report && npx allure open allure-report",
  "watch-report": "npx allure watch allure-results",
  "codegen": "npx playwright codegen https://www.cinesa.es"
}
```

---

## 🔧 **Configuraciones Avanzadas**

### **ESLint + Prettier Integration**

```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.{ts,js}'],
    ignores: ['node_modules/', 'dist/'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];
```

### **TypeScript Módulos ES6**

```json
// package.json
{
  "type": "module",
  "dependencies": {
    "dotenv": "^16.5.0",
    "imapflow": "^1.0.188"
  }
}
```

---

## 📊 **Cobertura de Funcionalidades**

### **Componentes Implementados (20+)**

| Componente          | Descripción                 | Tests | Status |
| ------------------- | --------------------------- | ----- | ------ |
| **Navbar**          | Navegación principal        | ✅    | ✅     |
| **Footer**          | Pie de página y enlaces     | ✅    | ✅     |
| **Login/Signup**    | Autenticación de usuarios   | ✅    | ✅     |
| **Movies**          | Cartelera y detalles        | ✅    | ✅     |
| **Cinemas**         | Cines y ubicaciones         | ✅    | ✅     |
| **SeatPicker**      | Selector de asientos        | ✅    | ✅     |
| **TicketPicker**    | Selector de entradas        | ✅    | ✅     |
| **PaymentPage**     | Proceso de pago             | ✅    | ✅     |
| **PurchaseSummary** | Resumen de compra           | ✅    | ✅     |
| **Bar**             | Servicios del bar           | ✅    | ✅     |
| **Blog**            | Contenido y noticias        | ✅    | ✅     |
| **Programs**        | Programas especiales        | ✅    | ✅     |
| **Promotions**      | Ofertas y promociones       | ✅    | ✅     |
| **Experiences**     | Experiencias premium        | ✅    | ✅     |
| **Coupons**         | Sistema de cupones          | ✅    | ✅     |
| **Mailing**         | Gestión de emails           | ✅    | ✅     |
| **Cookies**         | Banner y gestión de cookies | ✅    | ✅     |

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

---

## 🎯 **Fortalezas Únicas**

### **✅ Escalabilidad Extrema**

- **20+ Page Objects**: Cobertura completa del sitio
- **Fixtures Automatizados**: Setup/teardown transparente
- **Scripts Granulares**: Tests específicos por componente
- **Paralelización Optimizada**: 5 workers balanceados

### **✅ Calidad de Código Superior**

- **TypeScript Completo**: Tipado fuerte en todo el proyecto
- **ESLint + Prettier**: Calidad de código automatizada
- **JSDoc Documentación**: Métodos completamente documentados
- **Interfaces Tipadas**: Selectores y datos con tipos

### **✅ Testing Avanzado**

- **Data-Driven**: Separación completa de datos y tests
- **Assertion Classes**: Lógica de verificación reutilizable
- **Component Testing**: Tests específicos por componente
- **Email Integration**: Pruebas de email con ImapFlow

### **✅ Experiencia de Desarrollo**

- **IntelliSense Completo**: Autocompletado en todo el código
- **Debugging Avanzado**: Playwright UI Mode integrado
- **Live Reporting**: Allure watch mode
- **Code Generation**: Playwright codegen integrado

---

## 🔮 **Oportunidades de Mejora**

### **1. Adoptar Mejores Prácticas de demo-cinesa**

```typescript
// Implementar WebActions Wrapper
export class WebActions {
  async clickElementWithValidation(
    locator: string,
    errorMessage: string
  ): Promise<void> {
    await this.verifyElementIsDisplayed(locator, errorMessage);
    await this.page.click(locator);
  }
}

// Implementar BaseTest Pattern
const test = baseTest.extend<AllFixtures>(getAllFixtures());
```

### **2. Configuración de Ambientes**

```typescript
// testConfig.ts (a implementar)
export const testConfig = {
  dev: 'https://dev.cinesa.es/',
  ppe: 'https://ppe.cinesa.es/',
  prod: 'https://www.cinesa.es/',
};

// Usar variables de entorno
const ENVIRONMENT = process.env.ENVIRONMENT || 'prod';
baseURL: testConfig[ENVIRONMENT],
```

### **3. Enhanced Error Handling**

```typescript
// Implementar timeouts configurables
export const timeouts = {
  element: 30000,
  navigation: 60000,
  action: 10000,
};
```

### **4. Visual Regression Testing**

```typescript
// Implementar comparación visual
await expect(page).toHaveScreenshot('navbar-component.png');
```

---

## 📚 **Scripts de Comandos Útiles**

### **Ejecución de Tests**

```bash
# Todos los tests
npm test

# Test específico por componente
npm run test:navbar
npm run test:seatpicker
npm run test:movies

# Modo UI interactivo
npm run ui

# Generación de código
npm run codegen
```

### **Desarrollo y Debugging**

```bash
# Linting
npm run lint

# Reportes
npm run report
npm run watch-report

# Tests específicos con debugging
npx playwright test tests/cinesa/navbar/navbar.spec.ts --debug
```

---

## 🏆 **Conclusión**

El **playwright-template** representa una evolución significativa hacia un framework de testing más maduro y profesional. Mientras que **demo-cinesa** ofrece excelentes patrones base y gestión de ambientes, el **playwright-template** proporciona:

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
