# Playwright Template for Automated Testing

This project is a modern base template for building scalable, maintainable automated tests using [Playwright](https://playwright.dev/). It incorporates best practices like the Page Object Model, custom fixtures, automated reporting with Allure, and CI/CD integration with Azure Playwright Testing service.

## Table of Contents

- [Playwright Template for Automated Testing](#playwright-template-for-automated-testing)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Azure Playwright Testing Setup](#azure-playwright-testing-setup)
  - [Project Structure](#project-structure)
  - [Usage](#usage)
    - [Running Tests](#running-tests)
    - [Running Tests with Azure Playwright Testing](#running-tests-with-azure-playwright-testing)
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
- **Azure Playwright Testing:** Integrated with Microsoft Azure Playwright Testing service for cloud-based testing.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Azure CLI (for Azure Playwright Testing)
- Azure subscription with Playwright Testing service enabled

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

## Azure Playwright Testing Setup

This project is configured to work with Microsoft Azure Playwright Testing service for cloud-based testing with high scalability and rich reporting.

### Prerequisites for Azure Integration

- Azure CLI installed on your system
- Azure subscription with Playwright Testing service enabled
- Admin access to Azure subscription

### Step 1: Install Azure CLI

**Windows (using winget):**
```bash
winget install Microsoft.AzureCLI
```

**Alternative methods:**
- Download installer from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows
- Using PowerShell: `Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'; rm .\AzureCLI.msi`

### Step 2: Install Azure Playwright Testing Package

```bash
npm init @azure/microsoft-playwright-testing
```

This command will:
- Install the `@azure/microsoft-playwright-testing` package
- Create `playwright.service.config.ts` configuration file
- Set up the basic Azure integration

### Step 3: Authenticate with Azure

```bash
# Login to Azure
az login

# If you have multiple tenants, specify the tenant ID
az login --tenant <YOUR_TENANT_ID>
```

Use device code authentication if you encounter MFA issues:
```bash
az login --use-device-code
```

### Step 4: Create Azure Resources

1. **Create a resource group:**
   ```bash
   az group create --name "playwright-testing-rg" --location "West Europe"
   ```

2. **Create Playwright Testing Workspace:**
   - Go to https://portal.azure.com
   - Search for "Playwright Testing"
   - Create a new workspace with these settings:
     - **Resource Group:** playwright-testing-rg
     - **Workspace Name:** your-workspace-name
     - **Region:** West Europe

### Step 5: Configure Environment Variables

1. **Get your Service URL from Azure Portal:**
   - Navigate to your Playwright Testing workspace
   - Copy the Service URL (should look like: `wss://westeurope.api.playwright.microsoft.com/accounts/westeurope_XXXXX`)

2. **Update your `.env` file:**
   ```bash
   # Azure Playwright Testing Configuration
   PLAYWRIGHT_SERVICE_URL=wss://westeurope.api.playwright.microsoft.com/accounts/westeurope_YOUR_WORKSPACE_ID
   ```

### Step 6: Verify Configuration

Test your Azure setup:
```bash
npm run test:azure:navbar
```

### Azure-Specific Scripts

The following npm scripts are available for Azure testing:

- `npm run test:azure` - Run all tests on Azure (5 workers)
- `npm run test:azure:navbar` - Run navbar tests on Azure
- `npm run test:azure:seatpicker` - Run seat picker tests on Azure
- `npm run test:azure:movies` - Run movie tests on Azure

### Azure Configuration Files

- **`playwright.service.config.ts`** - Azure-specific Playwright configuration
- **`.env`** - Environment variables including Azure service URL
- **`package.json`** - Contains Azure-specific npm scripts

### Viewing Reports

After running tests with Azure:
1. **Azure Portal:** https://playwright.microsoft.com/
2. **Direct workspace:** https://playwright.microsoft.com/workspaces/YOUR_WORKSPACE_ID
3. **Specific runs:** URLs are provided in the terminal after test execution

### Troubleshooting Azure Setup

**Common Issues:**

1. **WebSocket connection errors:**
   - Reduce number of workers (configured to 5 in this project)
   - Check Azure subscription limits
   - Verify Service URL is correct

2. **Authentication issues:**
   - Ensure `az login` is successful
   - Verify tenant ID if using multiple tenants
   - Try `az login --use-device-code` for MFA issues

3. **Service URL not found:**
   - Verify workspace is created in Azure Portal
   - Check the Service URL format in your workspace settings
   - Ensure the workspace is in "Active" state

### Migration to New Azure Account

When migrating to a new Azure account:
1. Follow steps 3-5 with the new account credentials
2. Update the `PLAYWRIGHT_SERVICE_URL` in `.env`
3. Update any hardcoded references to the old workspace
4. Test the connection with `npm run test:azure:navbar`

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
├── playwright.service.config.ts  // Azure Playwright Testing configuration
├── .env                          // Environment variables (Azure service URL)
├── AZURE_SETUP.md               // Detailed Azure setup guide
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

### Running Tests with Azure Playwright Testing

**Azure Playwright Testing** provides cloud-based browser infrastructure with high scalability and rich reporting capabilities.

- **Run all tests on Azure:**

  ```bash
  npm run test:azure
  ```

- **Run specific test suites on Azure:**

  ```bash
  npm run test:azure:navbar          # Run navbar tests
  npm run test:azure:seatpicker      # Run seat picker tests
  npm run test:azure:movies          # Run movie tests
  ```

- **Run tests with custom configuration:**

  ```bash
  npx playwright test --config=playwright.service.config.ts --workers=5
  ```

**Azure Test Features:**
- **Cloud Browsers:** Tests run on cloud-hosted browsers (Linux environment)
- **Scalability:** Up to 20 parallel workers (configured to 5 for stability)
- **Rich Reporting:** Automatic upload to Azure Playwright Testing portal
- **Video & Screenshots:** Captured only on test failures for efficiency
- **Allure Integration:** Maintains local Allure reporting alongside Azure reports

**Monitoring Azure Test Runs:**
- **Azure Portal:** https://playwright.microsoft.com/
- **Your Workspace:** https://playwright.microsoft.com/workspaces/YOUR_WORKSPACE_ID
- **Test Results:** URLs provided in terminal after each run

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
import { assertNavbarElementsVisible, assertHomeUrl, assertNavClick, assertExternalNavClick } from './navbar.assertions';
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

  test('should click each navbar element and navigate accordingly', async ({ navbar, page }) => {
    for (const item of internalNavItems) {
      await assertNavClick(page, navbar.selectors[item.selectorKey], item.expectedUrl);
      await navbar.navigateToHome();
    }
    await assertExternalNavClick(page, navbar.selectors[externalNavItem.selectorKey], externalNavItem.expectedUrl);
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

Este README actualizado proporciona una guía completa para la instalación, configuración y ejecución de tests, integrando prácticas modernas y aprovechando las capacidades avanzadas de Playwright. ¿Qué opinas? ¿Te gustaría agregar o ajustar algún otro detalle?