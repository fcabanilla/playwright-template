/**
 * Playwright Configuration for Azure Playwright Workspaces (Cloud Browsers)
 *
 * This config extends the base playwright.config.ts to enable cloud-based test execution.
 * Tests run on remote browsers in Azure West Europe datacenter.
 *
 * Platform: Azure App Testing / Playwright Workspaces (GA - replaces deprecated Microsoft Playwright Testing)
 *
 * Usage:
 *   npx playwright test --config=playwright.service.config.ts --workers=20
 *
 * Prerequisites:
 *   1. Install @azure/playwright: npm install --save-dev @azure/playwright
 *   2. Set environment variables in .env file:
 *      - PLAYWRIGHT_SERVICE_URL=wss://westeurope.api.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/browsers
 *      - PLAYWRIGHT_SERVICE_ACCESS_TOKEN=<your-access-token>
 *      - USE_PLAYWRIGHT_SERVICE=true (optional - for conditional logic)
 *
 * Authentication Options:
 *   - Access Token (current setup - token in .env)
 *   - Microsoft Entra ID (recommended for production - requires `az login`)
 *
 * Documentation:
 *   - Quickstart: https://aka.ms/pww/docs/quickstart
 *   - CI/CD: https://aka.ms/pww/docs/ci
 *   - Migration: https://aka.ms/pww/docs/migration
 *
 * Migration Notice:
 *   Microsoft Playwright Testing is retiring March 8, 2026.
 *   This config uses the new @azure/playwright package for Playwright Workspaces.
 */

import { defineConfig, devices } from '@playwright/test';
import config from './playwright.config';
import { createAzurePlaywrightConfig, ServiceOS, ServiceAuth } from '@azure/playwright';
import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

/**
 * Validate required environment variables for cloud execution
 */
function validateEnvironment(): void {
  const required = ['PLAYWRIGHT_SERVICE_URL'];
  
  // Access token is required if not using Entra ID
  // (Entra ID authentication uses Azure CLI: az login)
  if (!process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN) {
    console.warn(
      '⚠️  PLAYWRIGHT_SERVICE_ACCESS_TOKEN not found.\n' +
      'Falling back to Microsoft Entra ID authentication.\n' +
      'Make sure you have run: az login\n'
    );
  }

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${missing.join(', ')}\n` +
        'Please configure them in your .env file.\n' +
        'See: https://aka.ms/pww/docs/quickstart'
    );
  }
}

// Validate environment before running
if (process.env.USE_PLAYWRIGHT_SERVICE === 'true' || process.env.PLAYWRIGHT_SERVICE_URL) {
  validateEnvironment();
}

/**
 * Azure Playwright Workspaces Configuration
 *
 * The createAzurePlaywrightConfig function merges base config with cloud-specific settings.
 * It handles:
 *   - WebSocket connection to Azure cloud browsers
 *   - Authentication (Access Token or Entra ID)
 *   - OS selection (Windows, Linux, macOS)
 *   - Parallelization and reporting
 */
export default defineConfig(
  config,
  createAzurePlaywrightConfig(config, {
    // OS for cloud browsers
    os: ServiceOS.LINUX, // Options: WINDOWS, LINUX (macOS not yet supported)

    // Authentication type
    // ACCESS_TOKEN: uses PLAYWRIGHT_SERVICE_ACCESS_TOKEN from .env
    // ENTRA_ID: uses Azure CLI authentication (az login)
    serviceAuthType: process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN 
      ? ServiceAuth.ACCESS_TOKEN 
      : ServiceAuth.ENTRA_ID,

    // Optional: Run ID for tracking test executions in Azure portal
    runId: process.env.GITHUB_RUN_ID || `local-${Date.now()}`,

    // Optional: Connection timeout for cloud browser operations (default: 30000ms)
    connectTimeout: 60000, // 60 seconds for initial cloud connection

    // Optional: Expose local network to cloud browsers
    // Useful if testing apps running on localhost
    // exposeNetwork: '<loopback>', // Uncomment if needed
  }),
  {
    // Override settings for cloud execution
    // Cloud can handle much higher parallelization than local browsers
    workers: process.env.CI ? 20 : 15, // CI: 20 parallel workers, Local: 15 workers

    // Enable fully parallel execution for maximum speed
    fullyParallel: true,

    // Extend timeouts for cloud latency
    timeout: 90000, // 90 seconds per test (cloud has network overhead)

    use: {
      // Cloud-specific artifact settings
      trace: 'on-first-retry', // Upload traces only on retry (saves bandwidth)
      video: 'retain-on-failure', // Upload videos only on failure
      screenshot: 'only-on-failure', // Screenshots on failure only

      // Keep base config timeouts
      actionTimeout: 30000,
      navigationTimeout: 30000,
    },

    // Projects for cloud execution
    // Azure Playwright Workspaces supports multiple OS-browser combinations
    projects: [
      // Cinesa - Cloud Chromium
      {
        name: 'Cinesa Cloud - Chromium',
        testMatch: /.*cinesa.*\.spec\.ts/,
        use: { ...devices['Desktop Chrome'] },
      },
      // UCI - Cloud Chromium
      {
        name: 'UCI Cloud - Chromium',
        testMatch: /.*uci.*\.spec\.ts/,
        use: { ...devices['Desktop Chrome'] },
      },
    ],

    // Reporter configuration for cloud
    reporter: [
      ['list'], // Console output
      ['html', { outputFolder: 'playwright-report-cloud' }], // Local HTML report
      ['json', { outputFile: 'test-results-cloud.json' }], // JSON for CI integration
      // Note: @azure/playwright automatically adds cloud reporter
    ],
  }
);
