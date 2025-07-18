# Azure Playwright Testing - Complete Setup Guide

This guide provides comprehensive instructions for setting up and migrating Azure Playwright Testing service integration.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Step-by-Step Setup](#step-by-step-setup)
- [Configuration Files](#configuration-files)
- [Environment Variables](#environment-variables)
- [Testing the Setup](#testing-the-setup)
- [Migration Guide](#migration-guide)
- [Troubleshooting](#troubleshooting)
- [Azure Portal Operations](#azure-portal-operations)

## Prerequisites

Before starting the Azure Playwright Testing setup, ensure you have:

- **Node.js** (v14 or higher)
- **Azure CLI** installed
- **Azure subscription** with admin access
- **Playwright Testing service** enabled in your Azure subscription

## Step-by-Step Setup

### 1. Install Azure CLI

**Windows (Recommended - using winget):**
```bash
winget install Microsoft.AzureCLI
```

**Alternative Installation Methods:**

**PowerShell (Direct download):**
```bash
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'; rm .\AzureCLI.msi
```

**Manual Download:**
- Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows
- Download and install the MSI package

**Verify Installation:**
```bash
az --version
```

### 2. Install Azure Playwright Testing Package

Run the following command in your project root:

```bash
npm init @azure/microsoft-playwright-testing
```

**This command will:**
- Install `@azure/microsoft-playwright-testing` package
- Create `playwright.service.config.ts` configuration file
- Set up basic Azure integration structure

### 3. Authenticate with Azure

**Standard Login:**
```bash
az login
```

**Multi-Tenant Login:**
If you belong to multiple Azure tenants, specify the tenant ID:
```bash
az login --tenant <YOUR_TENANT_ID>
```

**Device Code Authentication (for MFA issues):**
```bash
az login --use-device-code
```

**Verify Authentication:**
```bash
az account show
```

### 4. Create Azure Resources

**Create Resource Group:**
```bash
az group create --name "playwright-testing-rg" --location "West Europe"
```

**Create Playwright Testing Workspace (Azure Portal):**
1. Navigate to: https://portal.azure.com
2. Search for "Playwright Testing" in the search bar
3. Select "Microsoft Playwright Testing"
4. Click "Create"
5. Fill in the following details:
   - **Subscription:** Your Azure subscription
   - **Resource Group:** playwright-testing-rg
   - **Workspace Name:** your-workspace-name (e.g., "cinesa-playwright-workspace")
   - **Region:** West Europe
6. Click "Review + Create"
7. Click "Create"

### 5. Configure Service URL

**Get Service URL:**
1. Go to your created workspace in Azure Portal
2. In the workspace overview, find the "Service URL"
3. Copy the URL (format: `wss://westeurope.api.playwright.microsoft.com/accounts/westeurope_XXXXX`)

**Update Environment Variables:**
Create or update `.env` file in your project root:
```env
# Azure Playwright Testing Configuration
PLAYWRIGHT_SERVICE_URL=wss://westeurope.api.playwright.microsoft.com/accounts/westeurope_YOUR_WORKSPACE_ID
```

### 6. Update Configuration Files

**Ensure `playwright.service.config.ts` includes dotenv:**
```typescript
import { defineConfig } from '@playwright/test';
import { getServiceConfig, ServiceOS } from '@azure/microsoft-playwright-testing';
import config from './playwright.config';
import 'dotenv/config';

export default defineConfig(
  config,
  getServiceConfig(config, {
    exposeNetwork: '<loopback>',
    timeout: 30000,
    os: ServiceOS.LINUX,
    useCloudHostedBrowsers: true
  }),
  {
    reporter: [
      ['list'],
      ['@azure/microsoft-playwright-testing/reporter'],
      [
        'allure-playwright',
        {
          detail: false,
          outputFolder: 'allure-results',
          suiteTitle: false,
        },
      ],
    ],
    workers: 5, // Optimized for stability
    use: {
      ...config.use,
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
    },
  }
);
```

## Configuration Files

### `playwright.service.config.ts`

This file configures Azure Playwright Testing service integration:

- **Purpose:** Extends base Playwright configuration for Azure cloud testing
- **Key Features:**
  - Cloud-hosted browsers (Linux environment)
  - Azure-specific reporter
  - Optimized worker configuration
  - Allure integration maintained

### `.env`

Environment variables for Azure configuration:

```env
# Outlook credentials (existing)
OUTLOOK_USER=your-email@outlook.com
OUTLOOK_PASS=your-app-password

# Azure Playwright Testing Configuration
PLAYWRIGHT_SERVICE_URL=wss://westeurope.api.playwright.microsoft.com/accounts/westeurope_YOUR_WORKSPACE_ID
```

### `package.json` Scripts

Azure-specific npm scripts:

```json
{
  "scripts": {
    "test:azure": "npx playwright test --config=playwright.service.config.ts --workers=5",
    "test:azure:navbar": "npx playwright test tests/cinesa/navbar/navbar.spec.ts --config=playwright.service.config.ts --workers=5",
    "test:azure:seatpicker": "npx playwright test tests/cinesa/seatPicker/seatPicker.spec.ts --config=playwright.service.config.ts --workers=5",
    "test:azure:movies": "npx playwright test tests/cinesa/movies/movies.spec.ts --config=playwright.service.config.ts --workers=5"
  }
}
```

## Environment Variables

### Required Variables

| Variable | Description | Format | Example |
|----------|-------------|---------|---------|
| `PLAYWRIGHT_SERVICE_URL` | Azure service endpoint | `wss://region.api.playwright.microsoft.com/accounts/region_workspaceId` | `wss://westeurope.api.playwright.microsoft.com/accounts/westeurope_abc123` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PLAYWRIGHT_SERVICE_WORKERS` | Number of parallel workers | 5 |
| `PLAYWRIGHT_SERVICE_TIMEOUT` | Test timeout in milliseconds | 30000 |

## Testing the Setup

### Verify Configuration

1. **Check Azure Authentication:**
   ```bash
   az account show
   ```

2. **Test Single Spec:**
   ```bash
   npm run test:azure:navbar
   ```

3. **Run All Tests:**
   ```bash
   npm run test:azure
   ```

### Expected Behavior

**Successful Run Indicators:**
- Console shows: "Running tests using Microsoft Playwright Testing service"
- Test execution with specified number of workers
- "Initializing reporting for this test run" message
- Azure portal URL provided for results
- "Uploading test results" progress indicator

**Report Access:**
- **Azure Portal:** https://playwright.microsoft.com/
- **Workspace Direct:** https://playwright.microsoft.com/workspaces/YOUR_WORKSPACE_ID
- **Specific Run:** URL provided in terminal output

## Migration Guide

### When Migrating to New Azure Account

Follow these steps to migrate from one Azure account to another:

#### 1. Prepare New Account
```bash
# Logout from current account
az logout

# Login to new account
az login --tenant <NEW_TENANT_ID>

# Verify new account
az account show
```

#### 2. Create Resources in New Account
```bash
# Create new resource group
az group create --name "playwright-testing-rg-new" --location "West Europe"
```

#### 3. Create New Workspace
1. Follow Step 4 of setup guide with new account
2. Use new resource group name
3. Choose new workspace name

#### 4. Update Configuration
```bash
# Update .env file with new Service URL
PLAYWRIGHT_SERVICE_URL=wss://westeurope.api.playwright.microsoft.com/accounts/westeurope_NEW_WORKSPACE_ID
```

#### 5. Test New Configuration
```bash
npm run test:azure:navbar
```

#### 6. Update Documentation
- Update any hardcoded workspace IDs in documentation
- Update team access permissions in new workspace
- Update CI/CD pipeline configurations

## Troubleshooting

### Common Issues and Solutions

#### 1. Azure CLI Not Recognized
**Problem:** `az` command not found after installation

**Solutions:**
```bash
# Refresh PATH environment variable
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Or restart terminal/VS Code
```

#### 2. Authentication Failures
**Problem:** Login fails with MFA or tenant issues

**Solutions:**
```bash
# Use device code authentication
az login --use-device-code

# Specify tenant explicitly
az login --tenant <TENANT_ID>

# Clear Azure CLI cache
az account clear
az login
```

#### 3. WebSocket Connection Errors
**Problem:** Tests fail with WebSocket connection errors

**Solutions:**
- Reduce number of workers (already set to 5)
- Check Azure subscription quotas
- Verify Service URL format
- Ensure workspace is in "Active" state

#### 4. Service URL Not Working
**Problem:** "PLAYWRIGHT_SERVICE_URL variable is not set correctly"

**Solutions:**
```bash
# Verify .env file location (project root)
# Check URL format
wss://westeurope.api.playwright.microsoft.com/accounts/westeurope_XXXXX

# Ensure dotenv is imported in config
# Check for typos in workspace ID
```

#### 5. Resource Creation Failures
**Problem:** Cannot create resources in Azure

**Solutions:**
- Verify subscription has Playwright Testing service enabled
- Check user permissions (need Contributor role)
- Ensure resource group exists
- Try different region if current is unavailable

### Debug Commands

```bash
# Check current Azure account
az account show

# List available subscriptions
az account list

# Check resource group
az group show --name "playwright-testing-rg"

# Test Azure CLI connectivity
az account get-access-token
```

## Azure Portal Operations

### Accessing Your Workspace

1. **Azure Portal:** https://portal.azure.com
2. **Search:** "Playwright Testing"
3. **Select:** Your workspace from the list
4. **Overview:** View workspace details and Service URL

### Workspace Management

**Key Information Available:**
- Workspace ID and Service URL
- Resource group and subscription details
- Regional settings and quotas
- Test run history and metrics

**Operations Available:**
- View test run reports
- Monitor workspace usage
- Configure access permissions
- Download test artifacts

### Test Run Monitoring

**Direct Access:** https://playwright.microsoft.com/workspaces/YOUR_WORKSPACE_ID

**Available Features:**
- Real-time test execution monitoring
- Detailed test result analysis
- Video and screenshot artifacts
- Test duration and performance metrics
- Historical run comparisons

---

## Support and Resources

- **Azure Playwright Testing Documentation:** https://aka.ms/mpt/quickstart
- **Azure CLI Documentation:** https://docs.microsoft.com/en-us/cli/azure/
- **Playwright Documentation:** https://playwright.dev/
- **Azure Support:** https://azure.microsoft.com/support/
