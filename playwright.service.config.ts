import { defineConfig } from '@playwright/test';
import { getServiceConfig, ServiceOS } from '@azure/microsoft-playwright-testing';
import config from './playwright.config';
import 'dotenv/config';

/* Learn more about service configuration at https://aka.ms/mpt/config */
export default defineConfig(
  config,
  getServiceConfig(config, {
    exposeNetwork: '<loopback>',
    timeout: 30000,
    os: ServiceOS.LINUX,
    useCloudHostedBrowsers: false // Disabled due to authentication issues, using only reporting
  }),
  {
    /* 
    Playwright Testing service reporter is added by default.
    This will override any reporter options specified in the base playwright config.
    If you are using more reporters, please update your configuration accordingly.
    */
    reporter: [
      ['list'],
      ['@azure/microsoft-playwright-testing/reporter'],
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
    // Override workers for Azure service
    workers: 5, // Optimized for Azure service stability
    // Azure service specific settings
    use: {
      ...config.use,
      // Keep your existing video and screenshot settings
      screenshot: 'only-on-failure',
      video: 'retain-on-failure', // Changed to retain-on-failure for Azure efficiency
    },
  }
);
