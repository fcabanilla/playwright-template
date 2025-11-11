import { defineConfig } from '@playwright/test';
import * as os from 'node:os';
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import {
  getUCICinemasProject,
  getCinesaProject,
  getCinesaPortugalProject,
  getCloudflareOnlyProject,
  getCinesaCloudflareProject,
} from './config/projects';

// Load environment variables from .env file, if it exists.
dotenv.config();

function getBaseURLFromEnv() {
  const testEnv = process.env.TEST_ENV;
  const uciEnv = process.env.UCI_ENV;

  if (uciEnv) {
    switch (uciEnv) {
      case 'production':
        return 'https://www.ucicinemas.es';
      case 'preprod':
        return 'https://preprod-web.ocgtest.es';
      default:
        return 'https://www.ucicinemas.es';
    }
  }

  switch (testEnv) {
    case 'preprod':
      return 'https://preprod-web.ocgtest.es';
    case 'lab':
      return 'https://lab-web.ocgtest.es';
    case 'production':
    default:
      return 'https://www.cinesa.es';
  }
}

// Cross-platform Allure results directory
function getAllureResultsDir() {
  return path.resolve(process.cwd(), '.allure', 'results');
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 3,
  
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        outputFolder: getAllureResultsDir(),
        detail: true,
        suiteTitle: false,
      },
    ],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'reports/test-results.json' }],
  ],

  use: {
    baseURL: getBaseURLFromEnv(),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },

  projects: [
    getUCICinemasProject(),
    getCinesaProject(),
    getCinesaPortugalProject(),
    getCloudflareOnlyProject(),
    getCinesaCloudflareProject(),
  ],
});