/**
 * Playwright Configuration for Microsoft Playwright Testing Service
 *
 * This config extends the base playwright.config.ts to enable cloud-based test execution.
 * Tests run on remote browsers in Azure West Europe datacenter.
 *
 * Usage:
 *   npx playwright test --config=playwright.service.config.ts
 *
 * Prerequisites:
 *   1. Install @azure/playwright: npm install --save-dev @azure/playwright
 *   2. Set environment variables in .env file:
 *      - PLAYWRIGHT_SERVICE_URL
 *      - PLAYWRIGHT_SERVICE_ACCESS_TOKEN
 *      - USE_PLAYWRIGHT_SERVICE=true
 *
 * Documentation:
 *   https://learn.microsoft.com/en-us/azure/playwright-testing/
 */

import { defineConfig, devices } from '@playwright/test';
import config from './playwright.config';
import { getServiceConfig, ServiceOS } from '@azure/playwright';
import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

/**
 * Validate required environment variables
 */
function validateEnvironment(): void {
  const required = [
    'PLAYWRIGHT_SERVICE_URL',
    'PLAYWRIGHT_SERVICE_ACCESS_TOKEN',
  ];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please configure them in your .env file.'
    );
  }
}

// Validate before running
if (process.env.USE_PLAYWRIGHT_SERVICE === 'true') {
  validateEnvironment();
}

/**
 * Merge base config with cloud-specific settings
 */
export default defineConfig(
  config,
  getServiceConfig(config, {
    serviceOs: ServiceOS.WINDOWS, // Run on Windows browsers in cloud
    runId: `cloud-run-${Date.now()}`, // Unique identifier for this test run

    // Optional: Enable enhanced reporting
    exposeNetwork: '<loopback>', // Expose localhost for apps running locally
    timeout: 60000, // Cloud browsers may need more time for initial connection
  }),
  {
    // Override workers for cloud execution
    // Cloud can handle more parallelism than local
    workers: process.env.CI ? 20 : 15, // CI: 20 workers, Local: 15 workers

    // Disable fullyParallel to avoid overwhelming the service
    fullyParallel: true,

    // Extend timeouts for cloud latency
    timeout: 90000, // 90 seconds per test

    use: {
      // Cloud-specific settings
      trace: 'on-first-retry', // Upload traces on retry
      video: 'retain-on-failure', // Upload videos only on failure
      screenshot: 'only-on-failure', // Upload screenshots on failure

      // Keep existing settings from base config
      actionTimeout: 30000,
      navigationTimeout: 30000,
    },

    // Projects - use same projects as base config
    // Cloud execution supports all browser combinations
    projects: [
      // Cinesa projects
      {
        name: 'Cinesa Cloud - Chromium',
        testMatch: /.*cinesa.*\.spec\.ts/,
        use: { ...devices['Desktop Chrome'] },
      },
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
