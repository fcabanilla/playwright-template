# Playwright Template for Automated Testing

Modern template for scalable automated testing with Playwright, Azure integration, and Allure reporting.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
# Local execution with Azure reporting (recommended)
npm run test:navbar

# Generate Allure report
.\run-tests-with-allure.ps1
```

## 📁 Project Structure

```
├── tests/cinesa/               # Test files organized by feature
│   ├── navbar/                # Navigation tests
│   ├── seatPicker/            # Seat selection tests
│   └── ...                    # Other feature tests
├── fixtures/cinesa/           # Custom fixtures and page objects
├── pageObjectsManagers/       # Page Object Model classes
├── allure-results/            # Allure raw test data
├── allure-report/             # Generated HTML reports
├── playwright.local.config.ts # Local browsers + Azure reporting
├── playwright.service.config.ts # Cloud browsers (future)
└── azure-pipelines.yml       # Azure DevOps CI/CD
```

## 🎯 Available Test Commands

```bash
# Navigation tests
npm run test:navbar              # Local browsers
npm run test:azure:navbar        # Cloud browsers (when available)

# Seat picker tests  
npm run test:seatpicker          # Local browsers
npm run test:azure:seatpicker    # Cloud browsers (when available)

# All tests
npm run test                     # Default configuration
npm run test:azure               # Azure cloud browsers
```

## 📊 Reporting & Analytics

### Allure Reports
- **Generate**: `.\run-tests-with-allure.ps1` 
- **View**: Open `allure-report/index.html`
- **Features**: Screenshots, videos, detailed logs, trending

### Azure Dashboard
- **Live results**: https://playwright.microsoft.com/workspaces/westeurope_1f9793c4-7905-4e6a-b9aa-b9d47e97333c
- **Real-time**: Test execution monitoring
- **History**: Historical test data and trends

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `playwright.config.ts` | Base configuration |
| `playwright.local.config.ts` | Local browsers + Azure reporting |
| `playwright.service.config.ts` | Cloud browsers + Azure reporting |
| `azure-pipelines.yml` | CI/CD pipeline for Azure DevOps |

## 🛠️ Development

### Page Object Model
Tests use Page Object Model for maintainability:
```typescript
// Example test structure
test('should navigate correctly', async ({ page }) => {
  const navbarPage = new NavbarPage(page);
  await navbarPage.navigateToHome();
  await navbarPage.clickMenuItem('Cines');
  await expect(page).toHaveURL(/cines/);
});
```

### Custom Fixtures
Pre-configured browser and page setup:
- Screenshots on failure
- Video recording on failure  
- Timeout configurations
- Base URL setup

## 🚀 CI/CD Integration

### Azure DevOps
Pipeline runs automatically on push:
1. **Install dependencies**: npm ci
2. **Install browsers**: playwright install
3. **Run tests**: Local browsers + Azure reporting
4. **Generate reports**: Allure HTML reports
5. **Publish artifacts**: Results available for download

### GitHub Actions
Backup workflow available in `.github/workflows/`

## 📚 Documentation

- **[AZURE.md](./AZURE.md)**: Azure Playwright Testing setup and configuration
- **[ALLURE.md](./ALLURE.md)**: Allure reporting setup and usage
- **[Playwright Docs](https://playwright.dev/)**: Official Playwright documentation

## 🔍 Troubleshooting

### Common Issues
- **Java not found**: Run `.\run-tests-with-allure.ps1` (auto-configures Java)
- **Azure auth issues**: Run `az login` to authenticate
- **Tests timing out**: Check `timeout` settings in config files

### Debug Mode
```bash
# Run with UI (non-headless)
npx playwright test --headed

# Debug specific test
npx playwright test --debug tests/cinesa/navbar/navbar.spec.ts
```

## 📋 Requirements

- **Node.js**: 16+ 
- **Java**: 11+ (for Allure reports)
- **Azure CLI**: For Azure integration
- **Browsers**: Auto-installed via Playwright

## 🏗️ Architecture

### Local Development
- **Browsers**: Local Chromium/Firefox/WebKit
- **Reporting**: Azure dashboard + Local Allure
- **Speed**: Fast execution, immediate feedback

### CI/CD Pipeline  
- **Browsers**: Local browsers on hosted agents
- **Reporting**: Azure dashboard + Allure artifacts
- **Scalability**: Parallel execution, reliable results

### Future (Cloud Browsers)
- **Browsers**: Azure cloud browsers
- **Reporting**: Full Azure integration
- **Scalability**: Unlimited parallel execution

---

**Built with ❤️ using Playwright, Azure, and Allure**