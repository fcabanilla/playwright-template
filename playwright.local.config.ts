import { defineConfig } from '@playwright/test';
import config from './playwright.config';
import 'dotenv/config';

/* 
 * Configuration for local execution with Azure reporting only
 * This config uses local browsers but sends reports to Azure
 * Does not attempt to connect to Azure cloud browsers
 */
export default defineConfig(config, {
  reporter: [
    ['list'],
    ['@azure/microsoft-playwright-testing/reporter'],
  ],
  workers: 5,
  use: {
    ...config.use,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
