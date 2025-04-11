import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Timeout global para cada test (60 segundos)
  timeout: 60000,
  reporter: [
    ['line'],
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
  fullyParallel: true,
  use: {
    headless: false, // Ejecuta el navegador de forma visual
    screenshot: 'only-on-failure',
    video: 'on',
    // Timeout para acciones individuales (por ejemplo, page.click, page.fill, etc.)
    actionTimeout: 60000,
    // Timeout para navegaciones (por ejemplo, page.goto)
    navigationTimeout: 60000,

    launchOptions: {
      slowMo: 500,
    },
  },
});
