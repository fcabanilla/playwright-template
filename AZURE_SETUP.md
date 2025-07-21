# Azure Playwright Testing - Setup Guide

Complete guide for setting up Azure Playwright Testing service integration.

## Prerequisites

- **Node.js** (v14+)
- **Azure CLI** installed
- **Azure subscription** with admin access
- **⚠️ CRITICAL:** Permissions to register Azure features (may not work on free/trial subscriptions)

## Quick Setup

### 1. Install Azure CLI
```bash
winget install Microsoft.AzureCLI
az --version  # verify installation
```

### 2. Install Azure Playwright Package
```bash
npm init @azure/microsoft-playwright-testing
```

### 3. Register Azure Features (CRITICAL)
```bash
# Check current status
az feature list --namespace Microsoft.AzurePlaywrightService --query "[].{name: name, state: properties.state}" -o table

# Register required features
az feature register --namespace Microsoft.AzurePlaywrightService --name playwrightServiceBetaAccess
az feature register --namespace Microsoft.AzurePlaywrightService --name PlaywrightServicePublicPreviewRegions
az provider register -n Microsoft.AzurePlaywrightService
```

**⏱️ Note:** Features may show `Pending` for 24-48 hours. Without registration, workspaces will have `localAuth: Disabled`.

### 4. Authenticate & Create Resources
```bash
az login
az group create --name "playwright-testing-rg" --location "West Europe"
```

### 5. Create Workspace
1. Go to https://portal.azure.com/#create/microsoft.playwrighttesting
2. Fill details:
   - **Resource Group:** playwright-testing-rg
   - **Workspace Name:** your-workspace-name
   - **Region:** West Europe
3. Click "Create"

### 6. Configure Environment
Copy the Service URL from Azure Portal and update `.env`:
```env
PLAYWRIGHT_SERVICE_URL=wss://westeurope.api.playwright.microsoft.com/accounts/westeurope_YOUR_WORKSPACE_ID
```

### 7. Test Configuration
```bash
# Validate setup
npm run validate-azure-setup

# Run test with Azure reporting
npm run test:azure:navbar
```

**Expected Output:**
```
Running 3 tests using 3 workers
  3 passed (43.4s)
Uploading test results 100%
Test report: https://playwright.microsoft.com/workspaces/YOUR_WORKSPACE_ID/runs/RUN_ID
```

## Configuration Files

### `playwright.service.config.ts`
Azure configuration extending base Playwright setup:
```typescript
export default defineConfig(
  config,
  getServiceConfig(config, {
    useCloudHostedBrowsers: false, // Local browsers + Azure reporting
    workers: 5, // Optimized for stability
  }),
  {
    reporter: [
      ['list'],
      ['@azure/microsoft-playwright-testing/reporter'],
      ['allure-playwright', { outputFolder: 'allure-results' }],
    ],
  }
);
```

### Available Scripts
```bash
npm run test:azure              # All tests
npm run test:azure:navbar       # Navbar tests
npm run validate-azure-setup    # Validate configuration
npm run check-azure-features    # Monitor feature registration
```

## Troubleshooting

### Common Issues

**1. localAuth: Disabled**
- **Cause:** Azure features not registered
- **Solution:** Run feature registration commands and wait 24-48 hours

**2. Azure CLI Not Found**
```bash
# Refresh PATH or restart terminal
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

**3. Authentication Failures**
```bash
az login --use-device-code  # For MFA issues
az account clear; az login  # Clear cache
```

### Debug Commands
```bash
# Check feature registration
az feature list --namespace Microsoft.AzurePlaywrightService --query "[].{name: name, state: properties.state}" -o table

# Check authentication
az account show

# Validate setup
npm run validate-azure-setup
```

## Migration Between Accounts

1. **Logout and login to new account:**
   ```bash
   az logout
   az login --tenant <NEW_TENANT_ID>
   ```

2. **Create resources in new account**
3. **Update `.env` with new Service URL**
4. **Test:** `npm run test:azure:navbar`

## Monitoring and Next Steps

### Monitor Feature Registration
```bash
npm run check-azure-features
```

### When Cloud Browsers Become Available
1. Features will show "Registered" status
2. Workspace will show `"localAuth": "Enabled"`
3. Update: `useCloudHostedBrowsers: true`
4. Test: `npm run test:azure:navbar`

---

**Current Status (July 2025):**
- ✅ Local execution + Azure reporting working
- ⏳ Cloud browsers pending feature registration (24-48 hours)
- 🔧 Use `npm run check-azure-features` to monitor progress
