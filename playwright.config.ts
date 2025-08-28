import { defineConfig } from '@playwright/test';
import * as os from "node:os";

export default defineConfig({
  // Timeout global para cada test (60 segundos)
  timeout: 60000,

  // Configuración base que se aplicará a todos los proyectos
  use: {
    headless: false, // Ejecuta el navegador de forma visual
    screenshot: 'only-on-failure',
    video: 'on',
    // Timeout para acciones individuales (por ejemplo, page.click, page.fill, etc.)
    actionTimeout: 60000,
    // Timeout para navegaciones (por ejemplo, page.goto)
    navigationTimeout: 60000,

    // Configuraciones para evadir Cloudflare
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },

    // Headers adicionales para parecer más humano
    extraHTTPHeaders: {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'sec-ch-ua':
        '"Google Chrome";v="120", "Not_A Brand";v="8", "Chromium";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
    },
  },

  fullyParallel: true,
  workers: 5, // Optimized for stability and performance balance

  // Proyectos separados para UCI y Cinesa
  projects: [
    {
      name: 'UCI Cinemas',
      testDir: './tests/uci',
      use: {
        ...{
          headless: false,
          screenshot: 'only-on-failure',
          video: 'on',
          actionTimeout: 60000,
          navigationTimeout: 60000,
          // Configuraciones específicas para evadir detección
          launchOptions: {
            args: [
              '--disable-blink-features=AutomationControlled',
              '--disable-features=VizDisplayCompositor',
              '--disable-extensions',
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-accelerated-2d-canvas',
              '--no-first-run',
              '--no-zygote',
              '--disable-gpu',
              '--disable-background-timer-throttling',
              '--disable-backgrounding-occluded-windows',
              '--disable-renderer-backgrounding',
            ],
          },
        },
      },
    },
    {
      name: 'Cinesa',
      testDir: './tests/cinesa',
      use: {
        ...{
          headless: false,
          screenshot: 'only-on-failure',
          video: 'on',
          actionTimeout: 60000,
          navigationTimeout: 60000,
          // Configuraciones específicas para evadir detección
          launchOptions: {
            args: [
              '--disable-blink-features=AutomationControlled',
              '--disable-features=VizDisplayCompositor',
              '--disable-extensions',
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-accelerated-2d-canvas',
              '--no-first-run',
              '--no-zygote',
              '--disable-gpu',
              '--disable-background-timer-throttling',
              '--disable-backgrounding-occluded-windows',
              '--disable-renderer-backgrounding',
            ],
          },
        },
      },
    },
  ],

  // Reporter configurado para diferenciar proyectos
  reporter: [
    ['line'],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: true,
        environmentInfo: {
          Project: 'Multi-Cinema Test Suite',
          Environment: 'Test',
          Browser: 'Chromium',
          Note: 'Separated UCI and Cinesa projects',
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
          arch: os.arch(),
        },
      },
    ],
  ],
});
