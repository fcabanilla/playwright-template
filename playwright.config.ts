import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Timeout global para cada test (60 segundos)
  timeout: 60000,
  reporter: [
    ['line'],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: true,
        environmentInfo: {
          Project: 'UCI Cinemas Test Suite',
          Environment: 'Test',
          Browser: 'Chromium',
        },
      },
    ],
  ],
  fullyParallel: true,
  workers: 5, // Optimized for stability and performance balance
  use: {
    headless: false, // Ejecuta el navegador de forma visual
    screenshot: 'only-on-failure',
    video: 'on',
    // Timeout para acciones individuales (por ejemplo, page.click, page.fill, etc.)
    actionTimeout: 60000,
    // Timeout para navegaciones (por ejemplo, page.goto)
    navigationTimeout: 60000,
  },
});
