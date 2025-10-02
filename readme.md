# 🎬 Cinema Multi-Platform Test Automation Framework# 🎬 Cinema Multi-Platform Test Automation Framework

End-to-end test automation framework for multiple cinema chains using **Playwright** with **TypeScript**. Supports **Cinesa** (Spain) and **UCI Cinemas** (Italy) with scalable architecture for future expansions.Framework de automatización de pruebas end-to-end para múltiples cadenas de cines utilizando **Playwright** con **TypeScript**. Soporta **Cinesa** (España) y **UCI Cinemas** (Italia) con arquitectura escalable para futuras expansiones.

## 🎯 Project Purpose## 🎯 Propósito del Proyecto

This project solves the need for **consistent test automation** across multiple cinema platforms, ensuring:Este proyecto resuelve la necesidad de **automatización de pruebas consistente** para múltiples plataformas de cines, garantizando:

- **Uniform quality** across different cinema brands- **Calidad uniforme** entre diferentes marcas de cines

- **Early detection** of regressions in critical functionalities - **Detección temprana** de regresiones en funcionalidades críticas

- **Automated validation** of end-to-end purchase flows- **Validación automatizada** de flujos de compra end-to-end

- **Reduced time** on repetitive manual validations- **Reducción de tiempo** en validaciones manuales repetitivas

### Expected Impact### Impacto Esperado

- 🚀 **90% reduction** in manual validation time- 🚀 **90% reducción** en tiempo de validación manual

- 🎯 **95% coverage** of critical user flows- 🎯 **95% cobertura** de flujos críticos de usuario

- 📊 **Detailed reports** with quality metrics- 📊 **Reportes detallados** con métricas de calidad

- 🔄 **Continuous integration** with CI/CD- 🔄 **Integración continua** con CI/CD

## 📁 Project Structure## 📁 Estructura del Proyecto

```

playwright-template/playwright-template/

├── 📁 config/                  # Environment configurations├── 📁 config/                  # Configuraciones por entorno

│   ├── environments.ts        # URLs and platform configurations  │   ├── environments.ts        # URLs y configuraciones por plataforma

│   └── urls.ts                # Centralized URL mappings│   └── urls.ts                # Mapeo centralizado de URLs

├── 📁 core/                   # Framework base functionalities├── 📁 core/                   # Funcionalidades base del framework

│   ├── assertions/            # Custom assertions│   ├── assertions/            # Aserciones personalizadas

│   ├── base/                  # Base classes and abstractions│   ├── base/                  # Clases base y abstracciones

│   ├── types/                 # TypeScript type definitions│   ├── types/                 # Definiciones de tipos TypeScript

│   └── webactions/            # Unified web actions│   └── webactions/            # Acciones web unificadas

├── 📁 fixtures/               # Dependency injection per platform├── 📁 fixtures/               # Inyección de dependencias por plataforma

│   ├── cinesa/               # Cinesa-specific fixtures│   ├── cinesa/               # Fixtures específicos de Cinesa

│   └── uci/                  # UCI-specific fixtures│   └── uci/                  # Fixtures específicos de UCI

├── 📁 pageObjectsManagers/    # Page Objects per platform├── 📁 pageObjectsManagers/    # Page Objects por plataforma

│   ├── cinesa/               # Cinesa Page Objects│   ├── cinesa/               # Page Objects de Cinesa

│   │   ├── navbar/           # Navigation│   │   ├── navbar/           # Navegación

│   │   ├── movies/           # Movies│   │   ├── movies/           # Películas

│   │   ├── cinemas/          # Cinemas│   │   ├── cinemas/          # Cines

│   │   ├── login/            # Authentication│   │   ├── login/            # Autenticación

│   │   └── seatPicker/       # Seat selection│   │   └── seatPicker/       # Selección de asientos

│   └── uci/                  # UCI Page Objects│   └── uci/                  # Page Objects de UCI

├── 📁 tests/                 # Test suites per platform├── 📁 tests/                 # Suites de pruebas por plataforma

│   ├── cinesa/               # Cinesa tests (33 cases)│   ├── cinesa/               # Tests de Cinesa (33 casos)

│   └── uci/                  # UCI tests (in development)│   └── uci/                  # Tests de UCI (en desarrollo)

├── 📁 docs/                  # Project documentation├── 📁 docs/                  # Documentación del proyecto

├── 📁 allure-report/         # Generated HTML reports├── 📁 allure-report/         # Reportes HTML generados

└── 📁 test-results/          # Playwright native results└── 📁 test-results/          # Resultados nativos de Playwright

```

## ⚡ Quick Start## ⚡ Inicio Rápido

### Prerequisites### Prerrequisitos

- **Node.js** 18+ - **Node.js** 18+

- **npm** or **yarn**- **npm** o **yarn**

- **Git** configured- **Git** configurado

### Installation### Instalación

`bash`bash

# 1. Clone repository# 1. Clonar el repositorio

git clone https://github.com/fcabanilla/playwright-template.gitgit clone https://github.com/fcabanilla/playwright-template.git

cd playwright-templatecd playwright-template

# 2. Install dependencies# 2. Instalar dependencias

npm installnpm install

# 3. Install Playwright browsers# 3. Instalar navegadores de Playwright

npx playwright installnpx playwright install

# 4. Verify installation# 4. Verificar instalación

npm run test:cinesa:navbarnpm run test:cinesa:navbar

````



### Main Commands### Comandos Principales



#### Test Execution#### Ejecución de Tests



```bash```bash

# Complete tests per platform# Tests completos por plataforma

npm run test:cinesa              # All Cinesa testsnpm run test:cinesa              # Todos los tests de Cinesa

npm run test:uci                 # All UCI testsnpm run test:uci                 # Todos los tests de UCI



# Tests by functionality (Cinesa)# Tests por funcionalidad (Cinesa)

npm run test:navbar              # Navigationnpm run test:navbar              # Navegación

npm run test:movies              # Moviesnpm run test:movies              # Películas

npm run test:cinemas             # Cinemasnpm run test:cinemas             # Cines

npm run test:signup              # User registrationnpm run test:signup              # Registro de usuarios

npm run test:seatpicker          # Seat selectionnpm run test:seatpicker          # Selección de asientos



# UCI specific tests# Tests específicos UCI

npm run test:uci:navbar          # UCI navigationnpm run test:uci:navbar          # Navegación UCI

npm run test:uci:smoke           # UCI smoke testsnpm run test:uci:smoke           # Tests de humo UCI

npm run test:uci:critical        # UCI critical testsnpm run test:uci:critical        # Tests críticos UCI



# Execution modes# Modos de ejecución

npm run test -- --headed         # With graphical interfacenpm run test -- --headed         # Con interfaz gráfica

npm run test -- --debug          # Step-by-step debug modenpm run test -- --debug          # Modo debug paso a paso

npm run ui                       # Interactive Playwright UInpm run ui                       # Playwright UI interactiva

````

#### Report Generation#### Generación de Reportes

`bash`bash

# Generate and open Allure report# Generar y abrir reporte Allure

npm run report # Generate and open automaticallynpm run report # Genera y abre automáticamente

npm run report:generate # Generate onlynpm run report:generate # Solo generar

npm run report:open # Open existing onlynpm run report:open # Solo abrir existente

npm run report:clean # Clean previous reportsnpm run report:clean # Limpiar reportes anteriores

````



#### Development and Debug#### Desarrollo y Debug



```bash```bash

# Code generators# Generadores de código

npm run codegen                  # Cinesa code generationnpm run codegen                  # Cinesa code generation

npm run codegen:uci              # UCI code generationnpm run codegen:uci              # UCI code generation



# Linting and formatting# Linting y formato

npm run lint                     # Verify code with ESLintnpm run lint                     # Verificar código con ESLint

````

### Environment Configuration### Configuración por Entornos

`bash`bash

# Cinesa - different environments# Cinesa - diferentes entornos

npm run test:cinesa:staging # Staging environmentnpm run test:cinesa:staging # Entorno staging

npm run test:cinesa:dev # Development environmentnpm run test:cinesa:dev # Entorno desarrollo

TEST_ENV=preprod npm run test:cinesa # PreproductionTEST_ENV=preprod npm run test:cinesa # Preproducción

# UCI - different environments # UCI - diferentes entornos

npm run test:uci:staging # Staging environmentnpm run test:uci:staging # Entorno staging

npm run test:uci:dev # Development environmentnpm run test:uci:dev # Entorno desarrollo

```



## 🏗️ System Architecture## 🏗️ Arquitectura del Sistema



**Framework Layer Architecture:****Arquitectura en Capas del Framework:**



**Test Layer (Test Layer)****Test Layer (Capa de Pruebas)**

- **Test Cases**: Specific test cases organized by functionality- **Test Cases**: Casos de prueba específicos organizados por funcionalidad

- **Test Fixtures**: Dependency injection system for automatic setup- **Test Fixtures**: Sistema de inyección de dependencias para setup automático



**Page Object Layer (UI Abstraction Layer)****Page Object Layer (Capa de Abstracción UI)**

- **Page Object Managers**: Centralized managers for UI interactions- **Page Object Managers**: Gestores centralizados para interacciones con UI

- **Cinesa Pages**: Cinesa platform-specific Page Objects- **Cinesa Pages**: Page Objects específicos para la plataforma Cinesa

- **UCI Pages**: UCI platform-specific Page Objects- **UCI Pages**: Page Objects específicos para la plataforma UCI



**Core Layer (Central Layer)****Core Layer (Capa Central)**

- **WebActions**: Unified API for all browser interactions- **WebActions**: API unificada para todas las interacciones con browser

- **Assertions**: Reusable and extensible validation engine- **Assertions**: Motor de validaciones reutilizable y extensible

- **Base Classes**: Base classes providing common functionality- **Base Classes**: Clases base que proporcionan funcionalidad común



**Configuration Layer (Configuration Layer)****Configuration Layer (Capa de Configuración)**

- **Environments**: Environment-specific configurations (prod, staging, dev)- **Environments**: Configuraciones específicas por entorno (prod, staging, dev)

- **Playwright Config**: Central framework configuration- **Playwright Config**: Configuración central del framework de testing



**External Systems:****Sistemas Externos:**

- **Cinesa Website**: Main target platform for testing- **Cinesa Website**: Plataforma principal objetivo de las pruebas

- **UCI Website**: Second supported cinema platform- **UCI Website**: Segunda plataforma de cines soportada

- **Allure Reports**: Detailed reporting system with analytics- **Allure Reports**: Sistema de reportes detallados con analytics



**Dependency Flow:****Flujo de Dependencias:**

```

Test Cases → Page Objects → WebActions → BrowserTest Cases → Page Objects → WebActions → Browser

Fixtures → Configuration → Environment SetupFixtures → Configuration → Environment Setup

All Layers → Allure Reports (output)All Layers → Allure Reports (output)

````



### Test Execution Flow### Flujo de Ejecución de Tests



**Framework Execution Sequence:****Secuencia de Ejecución del Framework:**



1. **Test Case Initiation**: Test case requests necessary dependencies1. **Test Case Initiation**: El test case solicita las dependencias necesarias

2. **Fixture Setup**: Fixture system creates Page Object instances2. **Fixture Setup**: El sistema de fixtures crea instancias de Page Objects

3. **Page Object Actions**: Page Objects execute specific UI actions3. **Page Object Actions**: Los Page Objects ejecutan acciones específicas de UI

4. **WebActions Layer**: Translates actions to specific Playwright commands4. **WebActions Layer**: Traduce acciones a comandos Playwright específicos

5. **Browser Interaction**: Browser executes HTTP interactions and DOM manipulation5. **Browser Interaction**: El browser ejecuta interacciones HTTP y manipulación DOM

6. **Website Response**: Website responds with state changes and data6. **Website Response**: El sitio web responde con cambios de estado y datos



**Information Return Flow:****Flujo de Retorno de Información:**



1. **Browser Results**: Browser returns interaction results1. **Browser Results**: El browser retorna resultados de las interacciones

2. **WebActions Processing**: WebActions processes and structures results2. **WebActions Processing**: WebActions procesa y estructura los resultados

3. **Page Object State**: Page Objects update states and extract data3. **Page Object State**: Los Page Objects actualizan estados y extraen datos

4. **Test Validation**: Test case evaluates assertions and validations4. **Test Validation**: El test case evalúa aserciones y validaciones

5. **Result Reporting**: Results are sent to reporting system5. **Result Reporting**: Los resultados se envían al sistema de reportes



**Flow Characteristics:****Características del Flujo:**

- **Timeout Management**: 60 seconds per action, 30 seconds for navigation- **Timeout Management**: 60 segundos por acción, 30 segundos para navegación

- **Error Handling**: Automatic retry with exponential backoff- **Error Handling**: Retry automático con backoff exponencial

- **Resource Cleanup**: Automatic resource cleanup on completion- **Resource Cleanup**: Liberación automática de recursos al finalizar

- **Parallel Execution**: Up to 5 simultaneous workers for time optimization- **Parallel Execution**: Hasta 5 workers simultáneos para optimizar tiempo



## 🚀 First PR in ≤ 1 Hour## 🚀 Primer PR en ≤ 1 Hora



### Guide for New Developers### Guía para Nuevos Desarrolladores



#### Step 1: Environment Setup (15 min)#### Paso 1: Setup del Entorno (15 min)



```bash```bash

# Clone and configure# Clonar y configurar

git clone [repo-url]git clone [repo-url]

cd playwright-templatecd playwright-template

npm installnpm install

npx playwright installnpx playwright install



# Verify everything works# Verificar que todo funciona

npm run test:cinesa:navbarnpm run test:cinesa:navbar

````

#### Step 2: Explore an Existing Test (15 min)#### Paso 2: Explorar un Test Existente (15 min)

`typescript`typescript

// Examine: tests/cinesa/navbar/navbar.spec.ts// Examinar: tests/cinesa/navbar/navbar.spec.ts

import { test } from '../../fixtures/cinesa/playwright.fixtures';import { test } from '../../fixtures/cinesa/playwright.fixtures';

test('Navbar should display logo and main navigation', async ({ test('Navbar should display logo and main navigation', async ({

page, page,

navbarPage navbarPage

}) => {}) => {

await page.goto('/'); await page.goto('/');

await navbarPage.verifyLogoIsVisible(); await navbarPage.verifyLogoIsVisible();

await navbarPage.verifyMainNavigationItems(); await navbarPage.verifyMainNavigationItems();

});});

````



#### Step 3: Create Your First Test (20 min)#### Paso 3: Crear tu Primer Test (20 min)



```bash```bash

# Create new branch# Crear una nueva rama

git checkout -b feature/my-first-testgit checkout -b feature/mi-primer-test



# Create test file# Crear archivo de test

touch tests/cinesa/my-test/my-first-test.spec.tstouch tests/cinesa/mi-test/mi-primer-test.spec.ts

````

`typescript`typescript

// Basic content for your first test// Contenido básico para tu primer test

import { test, expect } from '../../fixtures/cinesa/playwright.fixtures';import { test, expect } from '../../fixtures/cinesa/playwright.fixtures';

test.describe('My First Test', () => {test.describe('Mi Primer Test', () => {

test('Verify page title', async ({ page }) => { test('Verificar título de la página', async ({ page }) => {

    await page.goto('/');    await page.goto('/');

    await expect(page).toHaveTitle(/Cinesa/);    await expect(page).toHaveTitle(/Cinesa/);

}); });

});});

````



#### Step 4: Execute and Validate (5 min)#### Paso 4: Ejecutar y Validar (5 min)



```bash```bash

# Execute your test# Ejecutar tu test

npx playwright test tests/cinesa/my-test/my-first-test.spec.tsnpx playwright test tests/cinesa/mi-test/mi-primer-test.spec.ts



# View report# Ver reporte

npm run report:generatenpm run report:generate

npm run report:opennpm run report:open

````

#### Step 5: Create PR (5 min)#### Paso 5: Crear PR (5 min)

`bash`bash

# Commit and push# Commit y push

git add .git add .

git commit -m "feat: add my first title test"git commit -m "feat: agregar mi primer test de título"

git push origin feature/my-first-testgit push origin feature/mi-primer-test

# Create PR on GitHub with provided template# Crear PR en GitHub con la plantilla proporcionada

````



## 📋 Project Status## 📋 Estado del Proyecto



### Current Metrics### Métricas Actuales



- ✅ **33 Test Cases** implemented (Cinesa)- ✅ **33 Test Cases** implementados (Cinesa)

- ✅ **5 Functional Areas** covered- ✅ **5 Áreas funcionales** cubiertas

- ✅ **88.2% Success Rate** in executions- ✅ **88.2% Tasa de éxito** en ejecuciones

- ✅ **100% Integration** with Azure DevOps- ✅ **100% Integración** con Azure DevOps

- 🔄 **UCI Tests** in development- 🔄 **UCI Tests** en desarrollo



### Roadmap### Roadmap



#### Q4 2024#### Q4 2024

- ✅ Framework base Cinesa completo

- ✅ Complete Cinesa base framework- ✅ Integración Allure 3 con tema oscuro

- ✅ Allure 3 integration with dark theme- ✅ Azure DevOps complete setup

- ✅ Complete Azure DevOps setup

#### Q1 2025

#### Q1 2025- 🔄 Expansión UCI Cinemas (en progreso)

- 📋 API testing integration

- 🔄 UCI Cinemas expansion (in progress)- 🎨 Visual regression testing

- 📋 API testing integration

- 🎨 Visual regression testing#### Q2 2025

- 🚀 CI/CD GitHub Actions

#### Q2 2025- 📱 Mobile responsive testing

- 📊 Performance benchmarking

- 🚀 CI/CD GitHub Actions

- 📱 Mobile responsive testing## 🔗 Enlaces Importantes

- 📊 Performance benchmarking

- [Documentación Playwright](https://playwright.dev/)

## 🔗 Important Links- [Allure Reports](https://docs.qameta.io/allure/)

- [Azure DevOps Project](https://dev.azure.com/[org]/[project])

- [Playwright Documentation](https://playwright.dev/)- [Architectural Decision Records](./docs/adrs/)

- [Allure Reports](https://docs.qameta.io/allure/)

- [Azure DevOps Project](https://dev.azure.com/[org]/[project])## ❓ FAQ

- [Architectural Decision Records](./docs/adrs/)

### ¿Cómo agregar una nueva plataforma de cines?

## ❓ FAQ

1. Crear estructura en `pageObjectsManagers/nueva-plataforma/`

### How to add a new cinema platform?2. Agregar configuración en `config/environments.ts`

3. Crear fixtures en `fixtures/nueva-plataforma/`

1. Create structure in `pageObjectsManagers/new-platform/`4. Configurar proyecto en `playwright.config.ts`

2. Add configuration in `config/environments.ts`

3. Create fixtures in `fixtures/new-platform/`### ¿Por qué algunos tests fallan con "Cloudflare protection"?

4. Configure project in `playwright.config.ts`

UCI Cinemas usa protección Cloudflare. Usa el método `navigateToWithCloudflareHandling()` para el primer acceso y asegúrate de tener `storageState` configurado.

### Why do some tests fail with "Cloudflare protection"?

### ¿Cómo ejecutar tests en paralelo de forma segura?

UCI Cinemas uses Cloudflare protection. Use the `navigateToWithCloudflareHandling()` method for first access and ensure you have `storageState` configured.

```bash

### How to run tests in parallel safely?# Para tests independientes

npm run test -- --workers=5

```bash

# For independent tests# Para tests con dependencias

npm run test -- --workers=5npm run test -- --workers=1

```

# For tests with dependencies

npm run test -- --workers=1### ¿Cómo agregar un nuevo test case?

```

1. Identificar la funcionalidad y plataforma

### How to add a new test case?2. Ubicar o crear el Page Object correspondiente

3. Crear el archivo `.spec.ts` en la carpeta apropiada

1. Identify functionality and platform4. Usar fixtures existentes para inyección de dependencias

2. Locate or create corresponding Page Object5. Agregar tags apropiados (`@smoke`, `@critical`, etc.)

3. Create `.spec.ts` file in appropriate folder

4. Use existing fixtures for dependency injection### ¿Cómo interpretar los reportes Allure?

5. Add appropriate tags (`@smoke`, `@critical`, etc.)

- **🔒 Cloudflare Protection Issues**: Problemas de acceso

### How to interpret Allure reports?- **🎭 Modal & Overlay Issues**: Elementos que bloquean interacciones

- **🧭 Navigation & URL Issues**: Problemas de navegación

- **🔒 Cloudflare Protection Issues**: Access problems- **🎬 Film Content Issues**: Problemas con contenido de películas

- **🎭 Modal & Overlay Issues**: Elements blocking interactions- **🏢 Cinema Selection Issues**: Problemas con selección de cines

- **🧭 Navigation & URL Issues**: Navigation problems

- **🎬 Film Content Issues**: Movie content problems### ¿Qué hacer si un test está flaky (inestable)?

- **🏢 Cinema Selection Issues**: Cinema selection problems

1. Revisar selectores CSS - podrían haber cambiado

### What to do if a test is flaky (unstable)?2. Verificar timeouts - ajustar en `config/environments.ts`

3. Comprobar overlays - usar `clickWithOverlayHandling()`

1. Review CSS selectors - they might have changed4. Revisar estado de la aplicación - validar precondiciones

2. Check timeouts - adjust in `config/environments.ts`

3. Check overlays - use `clickWithOverlayHandling()`### ¿Cómo contribuir con nuevas funcionalidades?

4. Review application state - validate preconditions

1. Revisar [CONTRIBUTING.md](./CONTRIBUTING.md)

### How to contribute new functionalities?2. Crear issue en Azure DevOps o GitHub

3. Seguir convenciones de código en [STYLEGUIDE.md](./docs/STYLEGUIDE.md)

1. Review [CONTRIBUTING.md](./CONTRIBUTING.md)4. Crear PR con tests incluidos

2. Create issue in Azure DevOps or GitHub

3. Follow code conventions in [STYLEGUIDE.md](./docs/STYLEGUIDE.md)### ¿Cómo configurar diferentes entornos?

4. Create PR with included tests

```bash

### How to configure different environments?# Variables de entorno

export TEST_ENV=staging

```bashexport CINESA_BASE_URL=https://staging.cinesa.es

# Environment variablesexport UCI_BASE_URL=https://staging.uci.it

export TEST_ENV=staging

export CINESA_BASE_URL=https://staging.cinesa.es# O usar comandos específicos

export UCI_BASE_URL=https://staging.uci.itnpm run test:cinesa:staging

npm run test:uci:dev

# Or use specific commands```

npm run test:cinesa:staging

npm run test:uci:dev---

```

**Versión del Framework**: 1.0.0

---**Última Actualización**: 2 de octubre de 2025

**Contacto**: Federico Cabanilla (@fcabanilla)

**Framework Version**: 1.0.0

**Last Updated**: October 2, 2025  ## 🚦 Ejecución Rápida por Entornos

**Contact**: Federico Cabanilla (@fcabanilla)

### 🔵 Producción (sin Cloudflare)

## 🚦 Quick Execution by Environments

```bash

### 🔵 Production (without Cloudflare)npm run test:cinesa

# O con interfaz gráfica

```bashnpx playwright test --project=Cinesa --headed

npm run test:cinesa```

# Or with graphical interface

npx playwright test --project=Cinesa --headed### 🟠 Preproducción (con Cloudflare)

```

1. **Generar estado de sesión:**

### 🟠 Preproduction (with Cloudflare)   ```bash

   npx playwright test tests/cinesa/cloudflare/auth.saveState.spec.ts --headed

1. **Generate session state:**   ```

   ```bash

   npx playwright test tests/cinesa/cloudflare/auth.saveState.spec.ts --headed2. **Ejecutar tests:**

   ```   ```bash

   npm run test:cinesa:preprod

2. **Execute tests:**   ```

   ```bash

   npm run test:cinesa:preprod## Table of Contents

   ```

- [Playwright Template for Automated Testing](#playwright-template-for-automated-testing)

---  - [Table of Contents](#table-of-contents)

  - [Features](#features)

> **Available in other languages:**  - [Prerequisites](#prerequisites)

> - [Español](./README.es.md) | **English** (current)  - [Installation](#installation)

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
  ```powershell
  # Preproducción (PowerShell en Windows):
  $env:TEST_ENV="preprod"; npx playwright test --project='Cinesa' --headed --workers=5
  ```

  ```bash
  # Producción (todos los sistemas):
  npx playwright test --project='Cinesa' --headed --workers=5
  ```

**Notas:**
- No subas archivos de sesión reales al repo (`.gitignore`).
- Solo para preproducción con Cloudflare.
````
