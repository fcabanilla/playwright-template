# 🎬 Cinema Multi-Platform Test Automation Framework

Framework de automatización de pruebas end-to-end para múltiples cadenas de cines utilizando **Playwright** con **TypeScript**. Soporta **Cinesa** (España) y **UCI Cinemas** (Italia) con arquitectura escalable para futuras expansiones.

## 🎯 Propósito del Proyecto

Este proyecto resuelve la necesidad de **automatización de pruebas consistente** para múltiples plataformas de cines, garantizando:

- **Calidad uniforme** entre diferentes marcas de cines
- **Detección temprana** de regresiones en funcionalidades críticas
- **Validación automatizada** de flujos de compra end-to-end
- **Reducción de tiempo** en validaciones manuales repetitivas

### Impacto Esperado

- 🚀 **90% reducción** en tiempo de validación manual
- 🎯 **95% cobertura** de flujos críticos de usuario
- 📊 **Reportes detallados** con métricas de calidad
- 🔄 **Integración continua** con CI/CD

## 📁 Estructura del Proyecto

```
playwright-template/
├── 📁 config/                  # Configuraciones por entorno
│   ├── environments.ts        # URLs y configuraciones por plataforma
│   └── urls.ts                # Mapeo centralizado de URLs
├── 📁 core/                   # Funcionalidades base del framework
│   ├── assertions/            # Aserciones personalizadas
│   ├── base/                  # Clases base y abstracciones
│   ├── types/                 # Definiciones de tipos TypeScript
│   └── webactions/            # Acciones web unificadas
├── 📁 fixtures/               # Inyección de dependencias por plataforma
│   ├── cinesa/               # Fixtures específicos de Cinesa
│   └── uci/                  # Fixtures específicos de UCI
├── 📁 pageObjectsManagers/    # Page Objects por plataforma
│   ├── cinesa/               # Page Objects de Cinesa
│   │   ├── navbar/           # Navegación
│   │   ├── movies/           # Películas
│   │   ├── cinemas/          # Cines
│   │   ├── login/            # Autenticación
│   │   └── seatPicker/       # Selección de asientos
│   └── uci/                  # Page Objects de UCI
├── 📁 tests/                 # Suites de pruebas por plataforma
│   ├── cinesa/               # Tests de Cinesa (33 casos)
│   └── uci/                  # Tests de UCI (en desarrollo)
├── 📁 docs/                  # Documentación del proyecto
└── 📁 .allure/               # Reporting (results, report, artifacts)
```

## ⚡ Inicio Rápido

### Prerrequisitos

- **Node.js** 18+
- **npm** o **yarn**
- **Git** configurado

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/fcabanilla/playwright-template.git
cd playwright-template

# 2. Instalar dependencias
npm install

# 3. Instalar navegadores de Playwright
npx playwright install

# 4. Verificar instalación
npm run test:cinesa:navbar
```

### Comandos Principales

#### Ejecución de Tests

```bash
# Tests completos por plataforma
npm run test:cinesa              # Todos los tests de Cinesa
npm run test:uci                 # Todos los tests de UCI

# Tests por funcionalidad (Cinesa)
npm run test:navbar              # Navegación
npm run test:movies              # Películas
npm run test:cinemas             # Cines
npm run test:signup              # Registro de usuarios
npm run test:seatpicker          # Selección de asientos

# Tests específicos UCI
npm run test:uci:navbar          # Navegación UCI
npm run test:uci:smoke           # Tests de humo UCI
npm run test:uci:critical        # Tests críticos UCI

# Modos de ejecución
npm run test -- --headed         # Con interfaz gráfica
npm run test -- --debug          # Modo debug paso a paso
npm run ui                       # Playwright UI interactiva
```

#### Generación de Reportes

```bash
# Generar y abrir reporte Allure
npm run report                   # Genera y abre automáticamente
npm run report:generate          # Solo generar
npm run report:open              # Solo abrir existente
npm run report:clean             # Limpiar reportes anteriores
```

#### Desarrollo y Debug

```bash
# Generadores de código
npm run codegen                  # Cinesa code generation
npm run codegen:uci              # UCI code generation

# Linting y formato
npm run lint                     # Verificar código con ESLint
```

### Configuración por Entornos

```bash
# Cinesa - diferentes entornos
npm run test:cinesa:staging      # Entorno staging
npm run test:cinesa:dev          # Entorno desarrollo
TEST_ENV=preprod npm run test:cinesa  # Preproducción

# UCI - diferentes entornos
npm run test:uci:staging         # Entorno staging
npm run test:uci:dev             # Entorno desarrollo
```

## 🏗️ Arquitectura del Sistema

**Arquitectura en Capas del Framework:**

**Test Layer (Capa de Pruebas)**

- **Test Cases**: Casos de prueba específicos organizados por funcionalidad
- **Test Fixtures**: Sistema de inyección de dependencias para setup automático

**Page Object Layer (Capa de Abstracción UI)**

- **Page Object Managers**: Gestores centralizados para interacciones con UI
- **Cinesa Pages**: Page Objects específicos para la plataforma Cinesa
- **UCI Pages**: Page Objects específicos para la plataforma UCI

**Core Layer (Capa Central)**

- **WebActions**: API unificada para todas las interacciones con browser
- **Assertions**: Motor de validaciones reutilizable y extensible
- **Base Classes**: Clases base que proporcionan funcionalidad común

**Configuration Layer (Capa de Configuración)**

- **Environments**: Configuraciones específicas por entorno (prod, staging, dev)
- **Playwright Config**: Configuración central del framework de testing

**Sistemas Externos:**

- **Cinesa Website**: Plataforma principal objetivo de las pruebas
- **UCI Website**: Segunda plataforma de cines soportada
- **Allure Reports**: Sistema de reportes detallados con analytics

**Flujo de Dependencias:**

```
Test Cases → Page Objects → WebActions → Browser
Fixtures → Configuration → Environment Setup
All Layers → Allure Reports (output)
```

### Flujo de Ejecución de Tests

**Secuencia de Ejecución del Framework:**

1. **Test Case Initiation**: El test case solicita las dependencias necesarias
2. **Fixture Setup**: El sistema de fixtures crea instancias de Page Objects
3. **Page Object Actions**: Los Page Objects ejecutan acciones específicas de UI
4. **WebActions Layer**: Traduce acciones a comandos Playwright específicos
5. **Browser Interaction**: El browser ejecuta interacciones HTTP y manipulación DOM
6. **Website Response**: El sitio web responde con cambios de estado y datos

**Flujo de Retorno de Información:**

1. **Browser Results**: El browser retorna resultados de las interacciones
2. **WebActions Processing**: WebActions procesa y estructura los resultados
3. **Page Object State**: Los Page Objects actualizan estados y extraen datos
4. **Test Validation**: El test case evalúa aserciones y validaciones
5. **Result Reporting**: Los resultados se envían al sistema de reportes

**Características del Flujo:**

- **Timeout Management**: 60 segundos por acción, 30 segundos para navegación
- **Error Handling**: Retry automático con backoff exponencial
- **Resource Cleanup**: Liberación automática de recursos al finalizar
- **Parallel Execution**: Hasta 5 workers simultáneos para optimizar tiempo

## 🚀 Primer PR en ≤ 1 Hora

### Guía para Nuevos Desarrolladores

#### Paso 1: Setup del Entorno (15 min)

```bash
# Clonar y configurar
git clone [repo-url]
cd playwright-template
npm install
npx playwright install

# Verificar que todo funciona
npm run test:cinesa:navbar
```

#### Paso 2: Explorar un Test Existente (15 min)

```typescript
// Examinar: tests/cinesa/navbar/navbar.spec.ts
import { test } from '../../fixtures/cinesa/playwright.fixtures';

test('Navbar should display logo and main navigation', async ({
  page,
  navbarPage,
}) => {
  await page.goto('/');
  await navbarPage.verifyLogoIsVisible();
  await navbarPage.verifyMainNavigationItems();
});
```

#### Paso 3: Crear tu Primer Test (20 min)

```bash
# Crear una nueva rama
git checkout -b feature/mi-primer-test

# Crear archivo de test
touch tests/cinesa/mi-test/mi-primer-test.spec.ts
```

```typescript
// Contenido básico para tu primer test
import { test, expect } from '../../fixtures/cinesa/playwright.fixtures';

test.describe('Mi Primer Test', () => {
  test('Verificar título de la página', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Cinesa/);
  });
});
```

#### Paso 4: Ejecutar y Validar (5 min)

```bash
# Ejecutar tu test
npx playwright test tests/cinesa/mi-test/mi-primer-test.spec.ts

# Ver reporte
npm run report:generate
npm run report:open
```

#### Paso 5: Crear PR (5 min)

```bash
# Commit y push
git add .
git commit -m "feat: agregar mi primer test de título"
git push origin feature/mi-primer-test

# Crear PR en GitHub con la plantilla proporcionada
```

## 📋 Estado del Proyecto

### Métricas Actuales

- ✅ **33 Test Cases** implementados (Cinesa)
- ✅ **5 Áreas funcionales** cubiertas
- ✅ **88.2% Tasa de éxito** en ejecuciones
- ✅ **100% Integración** con Azure DevOps
- 🔄 **UCI Tests** en desarrollo

### Roadmap

#### Q4 2024

- ✅ Framework base Cinesa completo
- ✅ Integración Allure 3 con tema oscuro
- ✅ Azure DevOps complete setup

#### Q1 2025

- 🔄 Expansión UCI Cinemas (en progreso)
- 📋 API testing integration
- 🎨 Visual regression testing

#### Q2 2025

- 🚀 CI/CD GitHub Actions
- 📱 Mobile responsive testing
- 📊 Performance benchmarking

## 🔗 Enlaces Importantes

- [Documentación Playwright](https://playwright.dev/)
- [Allure Reports](https://docs.qameta.io/allure/)
- [Azure DevOps Project](https://dev.azure.com/[org]/[project])
- [Architectural Decision Records](./docs/adrs/)

## ❓ FAQ

### ¿Cómo agregar una nueva plataforma de cines?

1. Crear estructura en `pageObjectsManagers/nueva-plataforma/`
2. Agregar configuración en `config/environments.ts`
3. Crear fixtures en `fixtures/nueva-plataforma/`
4. Configurar proyecto en `playwright.config.ts`

### ¿Por qué algunos tests fallan con "Cloudflare protection"?

UCI Cinemas usa protección Cloudflare. Usa el método `navigateToWithCloudflareHandling()` para el primer acceso y asegúrate de tener `storageState` configurado.

### ¿Cómo ejecutar tests en paralelo de forma segura?

```bash
# Para tests independientes
npm run test -- --workers=5

# Para tests con dependencias
npm run test -- --workers=1
```

### ¿Cómo agregar un nuevo test case?

1. Identificar la funcionalidad y plataforma
2. Ubicar o crear el Page Object correspondiente
3. Crear el archivo `.spec.ts` en la carpeta apropiada
4. Usar fixtures existentes para inyección de dependencias
5. Agregar tags apropiados (`@smoke`, `@critical`, etc.)

### ¿Cómo interpretar los reportes Allure?

- **🔒 Cloudflare Protection Issues**: Problemas de acceso
- **🎭 Modal & Overlay Issues**: Elementos que bloquean interacciones
- **🧭 Navigation & URL Issues**: Problemas de navegación
- **🎬 Film Content Issues**: Problemas con contenido de películas
- **🏢 Cinema Selection Issues**: Problemas con selección de cines

### ¿Qué hacer si un test está flaky (inestable)?

1. Revisar selectores CSS - podrían haber cambiado
2. Verificar timeouts - ajustar en `config/environments.ts`
3. Comprobar overlays - usar `clickWithOverlayHandling()`
4. Revisar estado de la aplicación - validar precondiciones

### ¿Cómo contribuir con nuevas funcionalidades?

1. Revisar [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Crear issue en Azure DevOps o GitHub
3. Seguir convenciones de código en [STYLEGUIDE.md](./docs/STYLEGUIDE.md)
4. Crear PR con tests incluidos

### ¿Cómo configurar diferentes entornos?

```bash
# Variables de entorno
export TEST_ENV=staging
export CINESA_BASE_URL=https://staging.cinesa.es
export UCI_BASE_URL=https://staging.uci.it

# O usar comandos específicos
npm run test:cinesa:staging
npm run test:uci:dev
```

---

**Versión del Framework**: 1.0.0  
**Última Actualización**: 2 de octubre de 2025  
**Contacto**: Federico Cabanilla (@fcabanilla)

## 🚦 Ejecución Rápida por Entornos

### 🔵 Producción (sin Cloudflare)

```bash
npm run test:cinesa
# O con interfaz gráfica
npx playwright test --project=Cinesa --headed
```

### 🟠 Preproducción (con Cloudflare)

1. **Generar estado de sesión:**

   ```bash
   npx playwright test tests/cinesa/cloudflare/*.spec.ts --headed
   ```

2. **Ejecutar tests:**
   ```bash
   npm run test:cinesa:preprod
   ```

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
├── .allure/results/                  # Allure raw results (current run)
├── .allure/report/                   # Allure HTML reports (generated)
├── .allure/playwright-artifacts/     # Videos, screenshots, traces
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

### 🟠 Preproducción, LAB, Staging (con Cloudflare)

**Paso 1: Generar sesión (una sola vez):**

```bash
# Lab
TEST_ENV=lab npx playwright test tests/cinesa/cloudflare/auth.saveState.spec.ts --headed --project="Cinesa"

# Preprod
TEST_ENV=preprod npx playwright test tests/cinesa/cloudflare/auth.saveState.spec.ts --headed --project="Cinesa"

# Staging
TEST_ENV=staging npx playwright test tests/cinesa/cloudflare/auth.saveState.spec.ts --headed --project="Cinesa"
```

**PowerShell:**
```powershell
$env:TEST_ENV="lab"; npx playwright test tests/cinesa/cloudflare/auth.saveState.spec.ts --headed --project="Cinesa"
```

*Hace login manualmente, pasa Cloudflare, el navegador se cierra automáticamente y guarda la sesión.*

**Paso 2: Ejecutar tests:**

```bash
# Lab
TEST_ENV=lab npx playwright test --project="Cinesa" --workers=1

# Preprod
TEST_ENV=preprod npx playwright test --project="Cinesa" --workers=1
```

**PowerShell:**
```powershell
$env:TEST_ENV="lab"; npx playwright test --project="Cinesa" --workers=1
```

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
├── 📁 .allure/results/                  # Resultados de ejecución actual
├── 📁 .allure/report/                   # Reportes HTML generados
├── 📁 .allure/playwright-artifacts/     # Videos, screenshots, traces
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
      outputFolder: '.allure/results',
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
