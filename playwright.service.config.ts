/**
 * Playwright Configuration for Azure Playwright Workspaces (Cloud Browsers)
 *
 * This config extends the base playwright.config.ts to enable cloud-based test execution.
 * Tests run on remote browsers in Azure West Europe datacenter.
 *
 * Platform: Azure App Testing / Playwright Workspaces (GA)
 * Package: @azure/playwright v1.0.0
 *
 * Usage:
 *   npx playwright test --config=playwright.service.config.ts --workers=20
 *
 * Authentication:
 *   - Access Token: Uses PLAYWRIGHT_SERVICE_ACCESS_TOKEN from .env (current setup)
 *   - Microsoft Entra ID: Uses Azure CLI (`az login`) - requires device enrollment
 *
 * Documentation:
 *   - Quickstart: https://aka.ms/pww/docs/quickstart
 *   - Config: https://aka.ms/pww/docs/config
 *   - CI/CD: https://aka.ms/pww/docs/ci
 */

import { defineConfig } from '@playwright/test';
import {
  createAzurePlaywrightConfig,
  ServiceOS,
  ServiceAuth,
} from '@azure/playwright';
import { DefaultAzureCredential } from '@azure/identity';
import config from './playwright.config';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

// Load environment variables from .env
dotenv.config();

/**
 * Determine authentication method:
 * - If PLAYWRIGHT_SERVICE_ACCESS_TOKEN exists -> use ACCESS_TOKEN
 * - Otherwise -> use ENTRA_ID (requires `az login`)
 */
const hasAccessToken = !!process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN;
const authMethod = hasAccessToken
  ? ServiceAuth.ACCESS_TOKEN
  : ServiceAuth.ENTRA_ID;

if (!hasAccessToken) {
  console.warn(
    '⚠️  PLAYWRIGHT_SERVICE_ACCESS_TOKEN not found in .env\n' +
      'Using Microsoft Entra ID authentication (requires: az login)\n'
  );
}

function getCloudRunId(): string {
  return (
    process.env.PLAYWRIGHT_RUN_ID ||
    process.env.BUILD_BUILDID ||
    process.env.BUILD_BUILDNUMBER ||
    process.env.GITHUB_RUN_ID ||
    randomUUID()
  );
}

/* Learn more about service configuration at https://aka.ms/pww/docs/config */
export default defineConfig(
  {
    ...config,
    projects: [
      ...config.projects!,
      // Diagnostic project without setup dependencies
      {
        name: 'Diagnostic',
        testMatch: '**/infrastructure/remote-browser-diagnostic.spec.ts',
        use: {
          headless: false,
        },
      },
    ],
  },
  createAzurePlaywrightConfig(config, {
    // OS for cloud browsers (LINUX recommended for better performance)
    os: ServiceOS.LINUX,

    // Authentication
    serviceAuthType: authMethod,
    ...(authMethod === ServiceAuth.ENTRA_ID && {
      credential: new DefaultAzureCredential(),
    }),

    // Network: Allow cloud browsers to access localhost (useful for local dev servers)
    exposeNetwork: '<loopback>',

    // Connection timeout: 3 minutes (cloud browsers may take longer to start)
    connectTimeout: 3 * 60 * 1000,

    // Optional: Unique run identifier (must be a valid GUID)
    // Prefer CI-provided identifiers so remote runs can be correlated with Azure DevOps.
    runId: getCloudRunId(),
  })
);
